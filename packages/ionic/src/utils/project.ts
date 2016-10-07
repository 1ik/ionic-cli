import * as fs from 'fs';
import * as path from 'path';

const PROJECT_FILE = 'ionic.config.json';

export interface Project {
  has(key: string): Promise<boolean>;
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  remove(key: string): Promise<void>;
  projectDirectory: string;
}

export default function (projectDirectory: string): Project {
  const projectFilePath = path.resolve(projectDirectory, PROJECT_FILE);
  let projectFileContents: { [key: string]: any; };

  async function has(key: string): Promise<boolean> {
    if (!projectFileContents) {
      projectFileContents = await getJsonFileContents(projectFilePath);
    }
    return projectFileContents.hasOwnProperty(key);
  }

  async function get(key: string): Promise<any> {
    if (!projectFileContents) {
      projectFileContents = await getJsonFileContents(projectFilePath);
    }
    return projectFileContents[key];
  }

  async function set(key: string, value: any): Promise<any> {
    if (!projectFileContents) {
      projectFileContents = await getJsonFileContents(projectFilePath);
    }
    projectFileContents[key] = value;
    await updateJsonFileContents(projectFileContents, projectFilePath);
  }

  async function remove(key: string): Promise<any> {
    if (!projectFileContents) {
      projectFileContents = await getJsonFileContents(projectFilePath);
    }
    delete projectFileContents[key];
    await updateJsonFileContents(projectFileContents, projectFilePath);
  }

  return {
    has,
    get,
    set,
    remove,
    projectDirectory
  };
}

function updateJsonFileContents(fileContents: { [key: string]: any; }, filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    var jsonString = JSON.stringify(fileContents, null, 2);

    fs.writeFile(filePath, jsonString, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

function getJsonFileContents(filePath: string): Promise<{ [key: string]: any; }> {
  return new Promise((resolve, reject) => {
    let fileContents = {};

    try {
      fs.readFile(filePath, 'utf8', (err: any, dataString: string) => {
        if (!err) {
          return reject(err);
        }
        fileContents = JSON.parse(dataString);
        resolve(fileContents);
      });
    } catch (e) {
      reject(e);
    }
  });
}