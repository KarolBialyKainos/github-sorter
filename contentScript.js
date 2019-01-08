const diffContainerSelector = '.js-diff-progressive-container';
const dict = {};
const files = [];
let initialNumberOfFiles;

const testPatterns = [
    /test\/java/,
    /spec.(ts|js)/,
    /Spec.(ts|js)/,
];

function getAllFiles() {
    return $('.file');
}

function getFilename(file) {
    return $(file).find('.file-header').attr('data-path');
}

function isTestFile(filename) {
    return testPatterns.some((pattern) => {
        const patt = new RegExp(pattern);
        return patt.test(filename);
    });
}

function decorateFile(filename) {
    if (isTestFile(filename)) {
        markTestOnList(filename);
        hideFileContent(filename);
    }
}

function hideFileContent(filename) {
    $(dict[filename]).find('button.js-details-target[aria-expanded="true"]').click();
}

function markTestOnList(filename) {
    $(dict[filename]).css('border-top', '3px solid #3f51b5');
}


function reorderElements() {
    const diffContainer = $(diffContainerSelector);
    
    regexSort(files, testPatterns).forEach(filename => {
        diffContainer.append($(dict[filename]));
    });
}

function startSorter() {
    console.log('startSorter, files ' + getAllFiles().length);
    getAllFiles().each((number, file) => {
        const filename = getFilename(file);
        files.push(filename);
        dict[filename] = file;
    
        decorateFile(filename);
    });
    
    // reorderElements();
}

function performCheckForNewFiles() {
    let numberOfTries = 0;
    const newFilesCheck = setInterval(() => {
        numberOfTries++;
        if (newFilesCheck > 5) {
            clearInterval(newFilesCheck);
        }

        if (getAllFiles().length > initialNumberOfFiles) {
            console.log('Found more files!');
            startSorter();
        }
    }, 1000);
}


const checkVar = setInterval(() => {
    if (!window.location.pathname.indexOf('files')) {
        return;
    }

    const numberOfFiles = getAllFiles().length;
    if (numberOfFiles === 0) {
        return;
    }

    initialNumberOfFiles = numberOfFiles;

    clearInterval(checkVar);
    startSorter();

    performCheckForNewFiles();
}, 100);

