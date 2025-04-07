import formidable from "formidable";

/**
 * Parses form data with formidable for Next.js App Router
 * @param {Request} req - Next.js App Router request object
 * @returns {Promise<{fields: Object, files: Object}>} - Parsed form data
 */
export async function parseFormWithFormidable(req) {
  // Save the request body as a buffer
  const data = await req.arrayBuffer();
  const buffer = Buffer.from(data);
  
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      // Use a custom fileWriteStreamHandler to handle file uploads
      fileWriteStreamHandler: () => {
        const chunks = [];
        return {
          on: (event, cb) => {
            if (event === 'error') {
              // Register error handler
            }
            return this;
          },
          write: (chunk) => {
            chunks.push(chunk);
            return true;
          },
          end: () => {
            // Do nothing on end
          }
        };
      }
    });
    
    // Create a mock request object that formidable can work with
    const mockReq = {
      headers: req.headers,
      read: function() {
        const result = buffer;
        buffer = null;
        return result;
      }
    };
    
    form.parse(mockReq, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
}