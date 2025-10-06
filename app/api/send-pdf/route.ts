'use server'; 

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST() {
  try {
    const webhookUrl = process.env.N8N_URL_PDF || '';

    // 1. Read the entire PDF file into a Buffer
    const pdfPath = path.join(process.cwd(), "public", "sample.pdf");
    const pdfBuffer = await fs.readFile(pdfPath); // This is crucial

    // 2. Create native FormData object
    const formData = new FormData();
    
    // 3. Append the Buffer as a Blob or File
    // Note: Node.js's global fetch supports Blob/File for FormData
    const pdfFile = new Blob([pdfBuffer], { type: 'application/pdf' });
    
    formData.append("dataPdf", pdfFile, "sample.pdf"); 

    const response = await fetch(webhookUrl, {
      method: "POST",
      body: formData, // TypeScript fix
    });
    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "PDF sent to webhook successfully!",
      data: data,
    });
  } catch (error) {
    console.error("Error sending PDF:", error);
    return NextResponse.json({ success: false, error: String(error) });
  }
}
