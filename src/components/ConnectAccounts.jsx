const handleUpload = async () => {
  if (!fitFiles || fitFiles.length === 0) {
    setUploadStatus('Please select one or more files first.');
    return;
  }

  if (!userId) {
    setUploadStatus('❌ No user found. Please complete onboarding first.');
    return;
  }

  const formData = new FormData();

  fitFiles.forEach((file) => {
    formData.append('fitFiles', file);
  });

  try {
    const response = await fetch(
      `https://easyathlete-backend-production.up.railway.app/upload-fit?userId=${userId}`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (response.ok) {
      setUploadStatus('✅ Files uploaded successfully.');
      setFitFiles([]);
    } else {
      setUploadStatus('❌ Upload failed. Try again.');
    }
  } catch (error) {
    console.error(error);
    setUploadStatus('❌ An error occurred during upload.');
  }
};
