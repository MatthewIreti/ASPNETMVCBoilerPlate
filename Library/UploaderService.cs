using System;
using System.Collections.Generic;
using System.IO;

namespace Library
{
    public class UploaderService
    {
        public static bool IsLocal;

        public static string SaveFileInTemp(string fileName, Stream inputStream)
        {
            return Local.SaveFileTemp(fileName, inputStream);
        }

        public static string CopyFileToDestination(string newFiles,
            object fileType, string oldFiles = null)
        {
            return Local.CopyFileFromTempToDestination(newFiles, fileType, oldFiles);
        }

        public static void DeleteOldFiles(string oldFiles, string newFiles)
        {
            Local.DeleteOldFile(oldFiles, newFiles);
        }

        private static class Local
        {
            private static readonly string Root = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Uploads");
            private const string SrcDirectory = "Temp";

            public static string SaveFileTemp(string fileName, Stream inputStream)
            {
                var filename = string.Format("{0}-{1}-{2}", Guid.NewGuid(), Guid.NewGuid(),
                    Path.GetExtension(fileName));

                var toFileName = Path.Combine(SrcDirectory, filename);
                var bytes = new byte[inputStream.Length];
                inputStream.Read(bytes, 0, (int)inputStream.Length);
                File.WriteAllBytes(Path.Combine(Root, toFileName), bytes);
                return toFileName;
            }

            public static string CopyFileFromTempToDestination(string newFiles,
                object fileType, string oldFiles = null)
            {
                if (newFiles == oldFiles)
                    return oldFiles;


                List<string> returnFiles = new List<string>();
                var destinationDirectory = fileType.ToString();

                if (!string.IsNullOrWhiteSpace(newFiles))
                {
                    foreach (var s in newFiles.Split(','))
                    {
                        if (!string.IsNullOrWhiteSpace(s))
                        {
                            var fromFileName = Path.Combine(SrcDirectory, Path.GetFileName(s));
                            var toFileName = Path.Combine(destinationDirectory, Path.GetFileName(s));

                            if (File.Exists(Path.Combine(Root, fromFileName)))
                                File.Move(Path.Combine(Root, fromFileName), Path.Combine(Root, toFileName));
                            returnFiles.Add(toFileName);
                        }
                    }
                }
                return string.Join(",", returnFiles);
            }

            public static void DeleteOldFile(string oldFiles, string newFile)
            {
                if (oldFiles == newFile)
                    return;
                if (!string.IsNullOrWhiteSpace(oldFiles))
                {
                    foreach (var s in oldFiles.Split(','))
                    {
                        var fileName = Path.Combine(Root, s);
                        if (File.Exists(fileName))
                            File.Delete(fileName);
                    }
                }
            }
        }
    }
}
