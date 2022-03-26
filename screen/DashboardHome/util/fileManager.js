import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import DocumentPicker from "react-native-document-picker";

export const fileSelect = async ({
  onSelect = () => null,
  onCancel = () => null,
  multiple = false,
  image = false,
  pdf = false,
}) => {
  // Opening Document Picker to select one file
  try {
    if (multiple) {
      if (image) {
        const res = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.images],
        });
        onSelect(res);
      } else if (pdf) {
        const res = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.pdf],
        });
        onSelect(res);
      } else {
        const res = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        });
        onSelect(res);
      }
    } else {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      onSelect(res);
    }
  } catch (err) {
    onCancel(null);
  }
};

export const openFile = (
  filePath,
  onFileClose = () => {},
  onSuccess = () => null,
  onFailure = () => null
) => {
  const url = encodeURI(filePath);
  console.log("file_url", url);
  const split = url.split("/");
  const nameToStore = split.pop();

  const localFile = `${RNFS.DocumentDirectoryPath}/${nameToStore}`;
  console.log("LocalFile", localFile);

  const options = {
    fromUrl: url,
    toFile: localFile,
    nameToStore: nameToStore,
  };

  RNFS.downloadFile(options)
    .promise.then((res) => {
      FileViewer.open(localFile, {
        onDismiss: onFileClose,
      });
      console.log("file loaded", res);
      onSuccess();
    })
    .catch((error) => {
      onFailure();
      console.log("file error", error);
    });
};
