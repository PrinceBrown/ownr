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
    
    const [currentImage, setCurrentImage] = useState(null);
    
    const [previousImages, setPreviousImages] = useState([]);
    const [images, setImages] = useState([]);



    
    
    
    const { data: categoryData, loading: categoryLoading, error: categoryError } = useSwr(URI+getAnimalsCategories, fetcher);
    const { data: photoData, loading: photoLoading, error: photoError } = useSwr(URI +getAnimalPhotosByCategory+categoryId, fetcher);
    
    useEffect(() => {
      console.log("!!!!!!! - previousImages", previousImages)
        console.log("!!!!! -images", images)
    }, [categoryId])
    
    
    
    
//    images = photoData && photoData.animalsByCategory.filter(photo => selectedCategories.includes(photo.category_id)).map((photo) => photo.photo_url) || [];
    
    useEffect(() => {
        if (images && images.length > 0) {
            setCurrentImage(getRandomImage());
        }
    }, [images]);

 
    useEffect(() => {
        setImages(photoData && photoData.animalsByCategory.filter(photo => selectedCategories.includes(photo.category_id)).map((photo) => photo.photo_url) || []);
    }, [photoData, selectedCategories, previousImages])
 



    if (categoryLoading || photoLoading) return <p>Loading...</p>;
    if (categoryError || photoError) return <p>Something happened :(</p>;

    console.log("categoryData", categoryData && categoryData.animal_categories)
 







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
        setCategoryId(parseInt(_categoryId));
        setCurrentIndex(0);
        handleToggleCategory(_categoryId);
    }


  
    function handleToggleCategory(_categoryId) {
        if (selectedCategories.includes(_categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== _categoryId));
        } else {
            const oldImages = images;
            setSelectedCategories([...selectedCategories, _categoryId]);
            setPreviousImages(oldImages);
        }
        shuffle(images);
    }
 

    // function handleToggleCategory(_categoryId) {
    //     const oldSelection = selectedCategories;
    //     if (selectedCategories.includes(_categoryId)) {
    //         setSelectedCategories(selectedCategories.filter(id => id !== _categoryId));
    //     } else {
    //         setSelectedCategories([...selectedCategories, _categoryId]);
    //         setPreviousImages(images);
    //     }
    //     const newImages = photoData && photoData.animalsByCategory.filter(photo => oldSelection.includes(photo.category_id)).map((photo) => photo.photo_url);

    //     // setImages([...images, ...newImages]);
    //     setImages([...previousImages, ...newImages]);


    //     shuffle(images);
    // }





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





                    <div className="relative container "  >

                        <div className="py-5 flex overflow-x-auto" style={{width: '100vw'}} >
                        {categoryData && categoryData.animal_categories.map((category, index) => (
                            category.category && <button onClick={() => handleCategoryChange(category.id)} className={`btn mx-3 ${selectedCategories.includes(category.id) ? 'btn-primary' : ''}`} key={index}>{category.category}</button>
                        ))}
                    </div>     
                </div>
 

                    





                    <div className=" flex py-5 rounded-lg">



                        <button
                            className={` text-3xl  px-2  ${currentIndex !== 0 ? 'visible' : 'invisible'} `} onClick={handlePrevious}>
                            <RxTrackPrevious />
                        </button>


                  <div className=" mx-4" >
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
