export function sendResponse(statusCode, body) {
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        statusCode,
        body: JSON.stringify(body),
    };
}

export function extractContentTypeFromImageBase64(base64Str) {
    const contentType = base64Str.substring('data:'.length, base64Str.indexOf(';base64'));
    const contentTypeTokens = contentType.split('/');
    const imageExtension = contentTypeTokens[contentTypeTokens.length - 1];
    return {
        contentType,
        imageExtension,
    };
}
