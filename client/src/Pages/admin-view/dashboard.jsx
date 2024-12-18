import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null); // Track the edited item ID
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  // Handle the feature image upload
  function handleUploadFeatureImage() {
    if (uploadedImageUrl) {
      dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
          setImageFile(null);
          setUploadedImageUrl("");
        }
      });
    }
  }

  // Fetch feature images when the component mounts
  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  // This function handles setting the edited ID when an item is being edited
  function handleEditImage(imageId) {
    setCurrentEditedId(imageId);
  }

  return (
    <div>
      {/* Image upload component */}
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        isEditMode={currentEditedId !== null} // Only enable edit mode when there's an edited ID
      />

      {/* Upload button */}
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>

      {/* Display feature images */}
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((featureImgItem) => (
            <div key={featureImgItem.id} className="relative">
              <img
                src={featureImgItem.image}
                className="w-full h-[300px] object-cover rounded-t-lg"
                alt={`Feature image ${featureImgItem.id}`}
              />
              <Button
                onClick={() => handleEditImage(featureImgItem.id)}
                className="absolute top-2 right-2 bg-blue-500 text-white"
              >
                Edit
              </Button>
            </div>
          ))
        ) : (
          <p>No feature images available.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
