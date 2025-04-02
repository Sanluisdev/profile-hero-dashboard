
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { useQuery } from "@tanstack/react-query";

interface FileUploaderProps {
  userId: string;
}

interface FileItem {
  name: string;
  url: string;
  path: string;
  type: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ userId }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const storage = getStorage();
  const folderPath = `studies/${userId}`;

  // Función para obtener los archivos del usuario
  const fetchUserFiles = async (): Promise<FileItem[]> => {
    const folderRef = ref(storage, folderPath);
    const fileList = await listAll(folderRef);
    
    const filesPromises = fileList.items.map(async (item) => {
      const url = await getDownloadURL(item);
      const name = item.name;
      const path = item.fullPath;
      // Determinar el tipo de archivo por la extensión
      const extension = name.split('.').pop()?.toLowerCase() || '';
      let type = 'document';
      
      if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
        type = 'image';
      } else if (['pdf'].includes(extension)) {
        type = 'pdf';
      } else if (['txt'].includes(extension)) {
        type = 'text';
      }
      
      return { name, url, path, type };
    });
    
    return Promise.all(filesPromises);
  };

  // Consulta para obtener los archivos
  const { data: files = [], refetch } = useQuery({
    queryKey: ['userFiles', userId],
    queryFn: fetchUserFiles,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    Array.from(selectedFiles).forEach(file => {
      uploadFile(file);
    });
    
    // Limpiar el input para permitir subir el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = (file: File) => {
    setUploading(true);
    setProgress(0);
    
    const fileRef = ref(storage, `${folderPath}/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const currentProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(currentProgress);
      },
      (error) => {
        console.error('Error uploading file:', error);
        setUploading(false);
        toast({
          title: 'Error al subir archivo',
          description: 'No se pudo subir el archivo. Por favor intenta nuevamente.',
          variant: 'destructive',
        });
      },
      async () => {
        setUploading(false);
        setProgress(0);
        toast({
          title: 'Archivo subido',
          description: `${file.name} ha sido subido correctamente.`,
        });
        refetch();
      }
    );
  };

  const handleDeleteFile = async (filePath: string, fileName: string) => {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      toast({
        title: 'Archivo eliminado',
        description: `${fileName} ha sido eliminado correctamente.`,
      });
      refetch();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error al eliminar archivo',
        description: 'No se pudo eliminar el archivo. Por favor intenta nuevamente.',
        variant: 'destructive',
      });
    }
  };

  const renderFileIcon = (fileType: string) => {
    return <File className="h-6 w-6" />;
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.txt"
        />
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-semibold">Sube tus estudios clínicos</h3>
          <p className="text-sm text-gray-500 mb-4">
            Arrastra y suelta tus archivos aquí o haz clic para seleccionar
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Formatos permitidos: JPG, PNG, PDF, TXT
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Seleccionar archivos
          </Button>
        </div>
        
        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Subiendo: {progress}%</p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Archivos subidos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {renderFileIcon(file.type)}
                  <div className="truncate max-w-[150px]">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline truncate block"
                    >
                      {file.name}
                    </a>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteFile(file.path, file.name)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
