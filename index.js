#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { getStatic } = require('./static');

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
    console.error('Usage: npx swagger2html <openapi.json/yaml> <output.html>');
    process.exit(1);
}

if (!fs.existsSync(inputPath)) {
    console.error(`The path: ${inputPath} is not exist!`);
    process.exit(1);
}

const outputFileType = path.extname(outputPath);
if (outputFileType.toLowerCase() !== '.html') {
    console.error(`File type ${outputFileType} not supported for output. Only html output can be given.`);
    process.exit(-1);
}

const inputFileType = path.extname(inputPath);
let swaggerSpec = null;

switch (inputFileType.toLowerCase()) {
    case ".json":
        swaggerSpec = fs.readFileSync(inputPath, "utf8");
        break;
    case ".yml":
    case ".yaml":
        const yml = fs.readFileSync(inputPath, "utf8");
        swaggerSpec = JSON.stringify(yaml.load(yml));
        break;
    default:
        console.error(`File type ${inputFileType} not supported. Supported file types: json, yaml, yml.`);
        process.exit(-1);
}


fs.writeFileSync(outputPath, getStatic(swaggerSpec));
