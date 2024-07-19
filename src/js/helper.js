import { TIMEOUT_SECONDS } from "./config.js";
function timeout(seconds) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(`Request took too long! Timeout after ${seconds} second`)
      );
    }, seconds * 1000);
  });
}

export async function AJAX(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

// export const getJSON = async function (url) {
//   try {
//     const req = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
//     const data = await req.json();
//     if (!req.ok) {
//       throw new Error(`${data.message} (${req.status})`);
//     }
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };
// export const sendJSON = async function (url, uploadData) {
//   try {
//     const req = await Promise.race([
//       fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(uploadData),
//       }),
//       timeout(TIMEOUT_SECONDS),
//     ]);
//     const data = await req.json();
//     if (!req.ok) {
//       throw new Error(`${data.message} (${req.status})`);
//     }
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };
