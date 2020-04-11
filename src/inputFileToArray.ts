import fs from "fs";
export const ERR_INVAL_FILE = "Failed to load file.";

/**
 * Given an input file path, returns an array of the file split by new line
 */
export default function inputFileToArray(inputFilePath: string): string[] {
  let orderBuffer;
  orderBuffer = fs.readFileSync(inputFilePath);
  // TODO: stream the data from the buffer. for now just converting to string
  return orderBuffer.toString().split("\n");
}
