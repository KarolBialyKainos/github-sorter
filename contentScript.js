const diffContainerSelector = '.js-diff-progressive-container';
const dict = {};
const files = [];

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
    $(dict[filename]).find('button.js-details-target').click();
}

function markTestOnList(filename) {
    $(dict[filename]).css('border-top', '3px solid blue');
}

function startSorter() {
    getAllFiles().each((number, file) => {
        const filename = getFilename(file);
        files.push(filename);
        dict[filename] = file;
    
        decorateFile(filename);
    });
    
    const diffContainer = $(diffContainerSelector);
    
    regexSort(files, testPatterns).forEach(filename => {
        diffContainer.append($(dict[filename]));
    });
}

const checkVar = setInterval(() => {
    if (!window.location.pathname.indexOf('files')) {
        return;
    }

    if (getAllFiles().length === 0) {
        return;
    }

    clearInterval(checkVar);
    startSorter();
}, 100);