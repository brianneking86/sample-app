const lineTypes = {
    PARAGRAPH: "PARAGRAPH",
    HEADER_ONE: "HEADER_ONE",
    HEADER_TWO: "HEADER_TWO",
    LINE_ITEM: "LINE_ITEM",
}

const wrapInTags = (line, type) => {
    switch(type) {
        case lineTypes.HEADER_ONE:
            return `<h1>${line}</h1>`;
        case lineTypes.HEADER_TWO:
            return `<h2>${line}</h2>`;
        case lineTypes.PARAGRAPH:
            return `<p>${line}</p>`;
        case lineTypes.LINE_ITEM:
            return `<li>${line}</li>`;
        default:
            return line;
    }
}

const getMarkdownType = (firstString) => {
    if (firstString.match(/#{1}/)) {
        return lineTypes.HEADER_ONE;
    }
    if (firstString.match(/#{2}/)) {
        return lineTypes.HEADER_TWO;
    }
    if (firstString.match(/\*{1}/)) {
        return lineTypes.LINE_ITEM;
    }
    if (firstString === "") {
        return null;
    }
    if (!firstString.match(/((#{2})|(#{1})|(\*{1}))/)) {
        return lineTypes.PARAGRAPH;
    }
}

export const markdownParser = (markdown) => {
    const htmlArray = [];
    let isLineItemBlock = false;
    let nextLine;
    let nextLineType;

    const splitMarkdown = markdown.split("\n");

    for (let i = 0; i < splitMarkdown.length; i++) {
        let line = splitMarkdown[i];
        const type = getMarkdownType(line.split(" ")[0]);
        
        // Remove the initial character if there is one
        line = line.replace(/[#\*]+/, "").trim();
        const htmlLine = wrapInTags(line, type);

        // In the case that it is <p> or <li>, we have to check to see what comes next
        if ((type === lineTypes.PARAGRAPH || type === lineTypes.LINE_ITEM) && i !== splitMarkdown.length - 1) {
            nextLine = splitMarkdown[i + 1];
            nextLineType = getMarkdownType(nextLine.split(" ")[0]);
        }

        if (type === lineTypes.LINE_ITEM) {
            // Check if we have started the line item block
            if (!isLineItemBlock) {
                isLineItemBlock = true;
                htmlArray.push("<ul>");
            }

            // Add line to html
            htmlArray.push(htmlLine);

            // if the next line is not a line item, then close the block
            if (nextLineType !== lineTypes.LINE_ITEM) {
                htmlArray.push("</ul>");
                isLineItemBlock = false;
            }

        } else {
            // For all other cases except <li> push to the array
            htmlArray.push(htmlLine);

            // For <p>, if the next line is also <p> then put in a line break
            if (type === lineTypes.PARAGRAPH && nextLineType === lineTypes.PARAGRAPH) {
                htmlArray.push("<br/>");
            }
        }
    }

    return htmlArray.join("");
}


// I dont remember what it was supposed to do when there was a \n between two paragraphs vs two new lines between two paragraphs so I may have done that wrong
export const sampleString = "# this is a header\nthis is a paragraph\nthis is another paragraph\n\nthis is a third paragraph\n* line item 1\n* line item 2\n* line item 3\n## this is a header two";