"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MutualFundData } from "@/lib/types";
import { Upload, FileText, Database, AlertCircle, Globe } from "lucide-react";
import { parseCSVData } from "@/lib/utils";

interface RagUploaderProps {
  onDataUpload: (data: MutualFundData[]) => void;
}

export default function RagUploader({ onDataUpload }: RagUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (selectedFile.name.endsWith(".csv")) {
        const text = await selectedFile.text();
        const parsedData = parseCSVData(text);
        onDataUpload(parsedData);
      } else {
        setUploadError("Only CSV files are supported for now");
        setIsUploading(false);
        return;
      }

      setUploadSuccess(true);
      setIsUploading(false);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to process the file. Please try again.");
      setIsUploading(false);
    }
  };

  const handleFetchAMFI = async () => {
    setIsUploading(true);
    setUploadError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUploadSuccess(true);
      setIsUploading(false);
    } catch (error) {
      console.error("AMFI fetch error:", error);
      setUploadError("Failed to fetch AMFI data. Please try again.");
      setIsUploading(false);
    }
  };

  const handleFetchKaggle = async () => {
    setIsUploading(true);
    setUploadError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));

      setUploadSuccess(true);
      setIsUploading(false);
    } catch (error) {
      console.error("Kaggle fetch error:", error);
      setUploadError("Failed to fetch Kaggle data. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Data Management
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-zinc-400">
          Upload your own data or connect to external sources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100 dark:bg-zinc-800">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700"
            >
              Upload Files
            </TabsTrigger>
            <TabsTrigger
              value="amfi"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700"
            >
              AMFI Data
            </TabsTrigger>
            <TabsTrigger
              value="kaggle"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700"
            >
              Kaggle
            </TabsTrigger>
            <TabsTrigger
              value="rag"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700"
            >
              RAG Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="pt-4 space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-500 dark:text-zinc-400" />
              <h3 className="text-lg font-medium mb-1 text-gray-900 dark:text-white">
                Upload Mutual Fund Data
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
                Drag and drop your CSV file or click to browse
              </p>
              <Input
                id="file-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline">Select File</Button>
              </Label>
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                  <FileText className="inline-block mr-1 h-4 w-4" />
                  {selectedFile.name}
                </div>
              )}
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <FileText className="h-4 w-4" />
                File uploaded successfully!
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full"
            >
              {isUploading ? "Processing..." : "Upload and Process Data"}
            </Button>
          </TabsContent>

          <TabsContent value="amfi" className="pt-4 space-y-4">
            <div className="border rounded-lg p-6 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
              <Database className="h-8 w-8 mb-2 text-gray-500 dark:text-zinc-400" />
              <h3 className="text-lg font-medium mb-1 text-gray-900 dark:text-white">
                Connect to AMFI Data
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
                Fetch the latest mutual fund data from AMFI's public API
              </p>
              <Button
                onClick={handleFetchAMFI}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? "Connecting..." : "Fetch AMFI Data"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="kaggle" className="pt-4 space-y-4">
            <div className="border rounded-lg p-6 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
              <Globe className="h-8 w-8 mb-2 text-gray-500 dark:text-zinc-400" />
              <h3 className="text-lg font-medium mb-1 text-gray-900 dark:text-white">
                Connect to Kaggle
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
                Access comprehensive mutual fund datasets from Kaggle
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="kaggle-username"
                      className="text-gray-700 dark:text-zinc-300"
                    >
                      Kaggle Username
                    </Label>
                    <Input
                      id="kaggle-username"
                      className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="kaggle-key"
                      className="text-gray-700 dark:text-zinc-300"
                    >
                      API Key
                    </Label>
                    <Input
                      id="kaggle-key"
                      type="password"
                      className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="kaggle-dataset"
                    className="text-gray-700 dark:text-zinc-300"
                  >
                    Dataset URL or ID
                  </Label>
                  <Input
                    id="kaggle-dataset"
                    placeholder="e.g., username/indian-mutual-funds-data"
                    className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                  />
                </div>
                <Button
                  onClick={handleFetchKaggle}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? "Connecting..." : "Connect to Kaggle"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rag" className="pt-4 space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-500 dark:text-zinc-400" />
              <h3 className="text-lg font-medium mb-1 text-gray-900 dark:text-white">
                Upload RAG Documents
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
                Add PDF, TXT, or DOCX files to enhance the AI's knowledge base
              </p>
              <Input
                id="rag-upload"
                type="file"
                accept=".pdf,.txt,.docx"
                className="hidden"
              />
              <Label htmlFor="rag-upload" className="cursor-pointer">
                <Button variant="outline">Select Documents</Button>
              </Label>
            </div>
            <Button className="w-full">Upload Documents</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 border-t border-gray-200 dark:border-zinc-800 pt-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          Supported Formats
        </h4>
        <div className="text-xs text-gray-500 dark:text-zinc-400">
          <p>• CSV files for mutual fund data</p>
          <p>• PDF, TXT, DOCX for RAG documents</p>
          <p>• Direct AMFI API connection</p>
          <p>• Kaggle datasets (requires API credentials)</p>
        </div>
      </CardFooter>
    </Card>
  );
}
