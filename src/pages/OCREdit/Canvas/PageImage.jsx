import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Image } from "react-konva";
import { canvasupdate } from "../../../redux/features/canvas.slice";

const PageImage = () => {
  const [image, setImage] = useState(null);
  const { imageurl, sectionwidth, sectionheight } = useSelector((state) => ({ ...state.canvas }));
  const dispatch = useDispatch();

  useEffect(() => {
    const imageToLoad = new window.Image();
    imageToLoad.src = imageurl;
    imageToLoad.addEventListener("load", () => {
      let newWidth = imageToLoad.width;
      let newHeight = imageToLoad.height;
      let imageRatio = newHeight/newWidth;
      let newScale = 1;
      if (newHeight > sectionheight || newWidth > sectionwidth) {
        if (imageRatio < 1){
          newWidth = sectionwidth;
          newHeight = Math.round(newWidth * imageRatio)
          newScale = newWidth/imageToLoad.width
        } else {
        newHeight = sectionheight;
        newWidth = Math.round(newHeight/imageRatio)
        newScale = newWidth/imageToLoad.width
        }
      }
      dispatch(canvasupdate({
        width: newWidth,
        height: newHeight,
        scale: newScale,
        orgwidth: imageToLoad.width,
        orgheight: imageToLoad.height,
      }));
      setImage(imageToLoad)
    });

    return () => imageToLoad.removeEventListener("load", null);
  }, [imageurl]);

  return (
    <Image
      image={image}
    />
  );
};

export default PageImage;