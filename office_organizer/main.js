#!/usr/bin/env node
let fs = require("fs");
let path = require("path");
let utilityObj = require("./utility");

let inputArr = process.argv.slice(2);

let command = inputArr[0];
let dirPath = inputArr[1];

// 1. take command and srcPath
// 2. loop over files and get their extensions
// 3. make folders acc to word,ppt,excel,pdf,others

if (command == "organize") {
    organizeFiles(dirPath);
} else {
    console.log("🙏 Please enter correct command");
}

function organizeFiles(dirPath) {

    if (dirPath == undefined) {
        console.log("Kindly enter the path");
        return;
    } else {
        let isPathCorrect = fs.existsSync(dirPath);
        if (!isPathCorrect) {
            console.log("Kindly enter correct path");
            return;
        }
        let dest = path.join(dirPath, "Organized MS Office");
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        organizeHelper(dirPath, dest);
    }

}

function organizeHelper(src, dest) {

    let children = fs.readdirSync(src);
    // console.log(allFiles);
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let childAddress = path.join(src, child);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
            let category = getCategory(child);
            // console.log(child + " belongs to " + category);
            putFile(childAddress,dest,category);
        }
    }

}

function getCategory(file) {
    let ext = path.extname(file);
    for (let type in utilityObj.types) {
        let currArr = utilityObj.types[type];
        for (let i = 0; i < currArr.length; i++) {
            if (ext == currArr[i])
            return type;
        }
    }
    return "Others";
}

function putFile(child, dest, category){
    // make folders of category
    // copy files to dest
    // cut from src

    let categoryPath = path.join(dest,category);
    if(!fs.existsSync(categoryPath)){
        fs.mkdirSync(categoryPath);
    }

    let childName = path.basename(child);
    let fileInCategory = path.join(categoryPath, childName);
    fs.copyFileSync(child,fileInCategory);
    fs.unlinkSync(child);
    console.log(childName + " has been shifted to " + category);

}