const path = require("path");

const uploadFile = async (file) => {
    if (!file) {
        throw new Error("No file provided for upload");
    } 
    // Sanitize the file name by replacing spaces with underscores
    const sanitizedFileName = file.name.replace(/\s+/g, '_');  
    
    // Use path.join to go one directory back and then into 'uploads'
    const uploadPath = path.join(__dirname, '../upload', sanitizedFileName);  
    
    await file.mv(uploadPath); 
    return sanitizedFileName; // Return the sanitized file name for database storage
};

// Export the uploadFile function
module.exports = uploadFile;
