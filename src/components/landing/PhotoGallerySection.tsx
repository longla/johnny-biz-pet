import FloatingBone from "../floating-bone";
import PhotoGallery from "../photo-gallery";

function PhotoGallerySection() {
  return (
    <section className="relative">
      <PhotoGallery />
      <FloatingBone />
    </section>
  );
}

export default PhotoGallerySection;
