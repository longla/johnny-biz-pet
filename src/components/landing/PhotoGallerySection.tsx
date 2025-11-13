import FloatingBone from "../floating-bone";
import FloatingYogaDog from "../floating-yoga-dog";
import PhotoGallery from "../photo-gallery";

function PhotoGallerySection() {
  return (
    <section className="relative">
      <PhotoGallery />
      <FloatingYogaDog />
      <FloatingBone />
    </section>
  );
}

export default PhotoGallerySection;
