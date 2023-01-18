import React, { useState } from "react";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/client'









const GET_ANIMAL_CATEGORIES = gql`
    query Animals_Categories  {
        animal_categories {
            id
            category
        }
    }

`;



const GET_ANIMAL_PHOTOS_BY_CATEGORY = gql`
    query  Animal_Photos_By_Category($categoryId: Int!) {
        animal_photos_by_category(category_id: $categoryId) {
            id
            category_id
            photo_url
        }
    }
`;







export function useAnimalPhotosByCategory(categoryId) {
    const { data, loading, error } = useQuery(GET_ANIMAL_PHOTOS_BY_CATEGORY, {
        variables: { categoryId },
    });

    return { data, loading, error };
}




function ImageCarousel() {

    const [currentIndex, setCurrentIndex] = useState(0);

    const [categoryId, setCategoryId] = useState(1);

    const [selectedCategoryId, setSelectedCategoryId] = useState(1);
    const [toggledCategories, setToggledCategories] = useState([]);
    const [ximages, setxImages] = useState([]);


    console.log("categoryId", categoryId)


    const { data: categoryData, loading: categoryLoading, error: categoryError } = useQuery(GET_ANIMAL_CATEGORIES);
    // const { data: photoData, loading: photoLoading, error: photoError } = useQuery(GET_ANIMAL_PHOTOS_BY_CATEGORY, { variables: { categoryId: categoryId },});
    const { data: photoData, loading: photoLoading, error: photoError } = useAnimalPhotosByCategory(categoryId);




    if (categoryLoading || photoLoading) return <p>Loading...</p>;
    if (categoryError || photoError) return <p>Error</p>;



    const images = photoData.animal_photos_by_category && photoData.animal_photos_by_category.map((photo) => photo.photo_url)

    console.log("images", images)
    const filteredImages = photoData.animal_photos_by_category.filter(image => {
        //return the images that are in the toggledCategories array
        console.log("image.category_id", image.category_id)
        console.log(toggledCategories.includes(image.category_id))
    });
    // toggledCategories.includes(image.categoryId)

    console.log("toggleCategories", toggledCategories)

    console.log("filteredImages", filteredImages)


    function handleNext() {
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    }

    function handlePrevious() {
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    }

    // function handleCategoryChange(categoryId) {
    //     setCategoryId(parseInt(categoryId));
    //     setSelectedCategoryId(categoryId);
    //     setCurrentIndex(0);
    // }


    //save the image in a state variable and then filter the images based on the category id
    // const [images, setImages] = useState([])
    // const [filteredImages, setFilteredImages] = useState([])
    // const [toggledCategories, setToggledCategories] = useState([])
    // const [selectedCategoryId, setSelectedCategoryId] = useState
    // const [categoryId, setCategoryId] = useState(1)

    // const { data: categoryData, loading: categoryLoading, error: categoryError } = useQuery(GET_ANIMAL_CATEGORIES);
    // const { data: photoData, loading: photoLoading, error: photoError } = useQuery(GET_ANIMAL_PHOTOS_BY_CATEGORY, { variables: { categoryId: categoryId
    // },});

    // if (categoryLoading || photoLoading) return <p>Loading...</p>;
    // if (categoryError || photoError) return <p>Error</p>;

    // const images = photoData.animal_photos_by_category && photoData.animal_photos_by_category.map((photo) => photo.photo_url)

    // const filteredImages = images.filter(image => {
    //     //return the images that are in the toggledCategories array
    //     console.log("image.category_id", image.category_id)
    //     console.log(toggledCategories.includes(image.category_id))
    // });
    // // toggledCategories.includes(image.categoryId)

    // console.log("toggleCategories", toggledCategories)

    // console.log("filteredImages", filteredImages)

    // function handleNext() {
    //     setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    // }

    // function handlePrevious() {
    //     setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    // }




    function handleCategoryChange(categoryId) {
        setCategoryId(parseInt(categoryId));
        setSelectedCategoryId(categoryId);
        setCurrentIndex(0);
    }

    function handleToggleCategory(categoryId) {
        if (toggledCategories.includes(categoryId)) {
            setToggledCategories(toggledCategories.filter((id) => id !== categoryId));
        } else {
            setToggledCategories([...toggledCategories, categoryId]);
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
                        {categoryData.animal_categories && categoryData.animal_categories.map((category, index) => (
                            <button
                                onClick={() => handleCategoryChange(category.id)}
                                className={`btn mx-3 ${category.id === selectedCategoryId ? 'btn-primary' : ''}`}
                                key={index}
                            >
                                {category.category} {category.id}
                            </button>
                        ))}

                    </div>





                    <div className=" flex py-5 rounded-lg">



                        <button
                            className={` text-3xl  px-2  ${currentIndex !== 0 ? 'visible' : 'invisible'} `} onClick={handlePrevious}>
                            <RxTrackPrevious />
                        </button>


                        <div className=" mx-4" >

                            {/* One way we can prevent layout shift by setting fixed width and height */}
                            <img
                                className="rounded shadow-lg shadow-base-400 w-full h-full object-contain"
                                src={images[currentIndex]}
                                alt="carousel of animals"
                            />
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
