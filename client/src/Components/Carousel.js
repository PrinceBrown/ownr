/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from "react";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import useSwr from "swr";





 












const fetcher = (url) => fetch(url).then((r) => r.json());

const URI = "http://localhost:8500/api";
const getAnimalsCategories = "/all-categories"
const getAnimalPhotosByCategory = "/animals-categories/"
 




function ImageCarousel() {



    const [currentIndex, setCurrentIndex] = useState(0);
    
    const [categoryId, setCategoryId] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState([1]);
    
    const [previousSelection, setPreviousSelection] = useState(selectedCategories);
    const [currentImage, setCurrentImage] = useState(null);
    const [previousImages, setPreviousImages] = useState([]);
    const [images, setImages] = useState([]);
    const [isPreviousSelection, setIsPreviousSelection] = useState(false);


    
    
    
    const { data: categoryData, loading: categoryLoading, error: categoryError } = useSwr(URI+getAnimalsCategories, fetcher);
    const { data: photoData, loading: photoLoading, error: photoError } = useSwr(URI +getAnimalPhotosByCategory+categoryId, fetcher);
    
    console.log("categoryId", categoryId)
    
    
    useEffect(() => {
        setPreviousImages([]);
    }, [images]);



    useEffect(() => {
        setPreviousSelection(selectedCategories);
    }, [selectedCategories]);

    
//    images = photoData && photoData.animalsByCategory.filter(photo => selectedCategories.includes(photo.category_id)).map((photo) => photo.photo_url) || [];
    
    useEffect(() => {
        if (images && images.length > 0) {
            setCurrentImage(getRandomImage());
        }
    }, [images]);

 
    useEffect(() => {
        setImages(photoData && photoData.animalsByCategory.filter(photo => selectedCategories.includes(photo.category_id)).map((photo) => photo.photo_url) || []);
    }, [photoData, selectedCategories])

    useEffect(() => {
        if (images && images.length > 0) {
            setCurrentImage(getRandomImage());
        }
    }, [images]);




    if (categoryLoading || photoLoading) return <p>Loading...</p>;
    if (categoryError || photoError) return <p>Error</p>;

    console.log("categoryData", categoryData && categoryData.animal_categories)
 



    console.log("images", images)
 






    function handleNext() {
        if (images) {
            setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
            setCurrentImage(getRandomImage());
        }
    }

    function handlePrevious() {
        if (images) {
            setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
        }
    }


  

    function handleCategoryChange(_categoryId) {
        setPreviousImages([...images]);
        setCategoryId(parseInt(_categoryId));
        setCurrentIndex(0);
        handleToggleCategory(_categoryId)
    }

 
    function handleToggleCategory(_categoryId) {
        if (selectedCategories.includes(_categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== _categoryId));
        } else {
            setSelectedCategories([...selectedCategories, _categoryId]);
        }
        const newImages = photoData && photoData.animalsByCategory.filter(photo => _categoryId == photo.category_id).map((photo) => photo.photo_url) || []
        setImages([...previousImages, ...newImages]);
        shuffle(images);
    }





    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    function getRandomImage() {
        if (images) {
            const randomIndex = Math.floor(Math.random() * images.length);
            return images[randomIndex];
        }
    }






    return (
        <>

            {!categoryLoading && !photoLoading && !categoryError && !photoError && (
                <div>

                    <div className="mb-3">
                        <h1 className="text-4xl text-center">Image Carousel</h1>

                        <div>
                            <p className="text-center">Click on the arrows to navigate through the images</p>
                        </div>


                    </div>




 
                    <div className="py-5 flex items-center justify-center overflow-x-auto white-space-nowrap" style={{ overflowX: 'auto' }}>
                       {/* {categoryData && categoryData.animal_categories.map((category, index) => (
                            <button
                                onClick={() => handleCategoryChange(category.id)}
                                className={`btn mx-3 ${parseInt(category.id) === categoryId ? 'btn-primary' : ''}`}
                                key={index}
                            >
                                {category.category} {category.id}
                            </button>
                        ))}  */}

                        <div className="py-5 flex items-center justify-center overflow-x-auto white-space-nowrap" style={{ overflowX: 'auto' }}>
                            {categoryData && categoryData.animal_categories.map((category, index) => (
                                <button onClick={() => {
                                    handleCategoryChange(category.id)
                                    if (isPreviousSelection) {
                                        setSelectedCategories(previousSelection);
                                        setIsPreviousSelection(false);
                                    } else {
                                        setPreviousSelection(selectedCategories);
                                        setSelectedCategories([category.id]);
                                        setIsPreviousSelection(true);
                                    }
                                }} className={`btn mx-3 ${selectedCategories.includes(category.id) ? 'btn-primary' : ''}`} key={index}>{category.category}</button>
                            ))}
                        </div>

                    </div>      





                    <div className=" flex py-5 rounded-lg">



                        <button
                            className={` text-3xl  px-2  ${currentIndex !== 0 ? 'visible' : 'invisible'} `} onClick={handlePrevious}>
                            <RxTrackPrevious />
                        </button>


                        <div className=" mx-4" >

                            {/* One way we can prevent layout shift by setting fixed width and height */}
                            {/* <img
                                className="rounded shadow-lg shadow-base-400 w-full h-full object-contain"
                                src={images[currentIndex]}
                                alt="carousel of animals"
                            /> */}
                            {currentImage && <img src={currentImage} alt={currentImage} />}



                        </div>






                        <button className={`text-3xl  px-2  ${currentIndex !== images.length - 1 ? 'visible' : 'invisible'} `} onClick={handleNext}>
                            <RxTrackNext />
                        </button>


                    </div>

                </div>

            )}


        </>
    );
}

export default ImageCarousel;
