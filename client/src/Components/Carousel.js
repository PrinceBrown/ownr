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







function ImageCarousel() {

    const [currentIndex, setCurrentIndex] = useState(0);

    // const { loading, error, data } = useQuery(GET_ANIMAL_CATEGORIES)

    const [categoryId, setCategoryId] = useState(1);


    const { loading, error, data } = useQuery(GET_ANIMAL_PHOTOS_BY_CATEGORY, { variables: { categoryId } });

    if (loading) return <p>Loading....</p>
    if (error) return <p>Something went wrong :(</p>



    // console.log("data", data.animal_photos_by_category)

    //loop through data.animal_photos_by_category and return as an array of images

    const images = data.animal_photos_by_category && data.animal_photos_by_category.map((photo) => photo.photo_url)

    // console.log("images", imagesx)


 



    // const images = ["https://founded.media/hiring/photos/cats/14157413946_fea785b4d6_k.jpg",
    //     "https://founded.media/hiring/photos/cats/16175483119_bd7374d8a8_h.jpg",
    //     "https://founded.media/hiring/photos/cats/13901304865_a444cf4d34_k.jpg"];





    function handleNext() {
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    }

    function handlePrevious() {
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    }



    return (
        <>

            {!loading && !error && (
                <div>

                    <div className="mb-3">
                        <h1 className="text-4xl text-center">Image Carousel</h1>

                        <div>
                            <p className="text-center">Click on the arrows to navigate through the images</p>
                        </div>


                    </div>





                    <div className="py-5 flex items-center justify-center overflow-x-auto white-space-nowrap" style={{ overflowX: 'auto' }}>
                        {data.animal_categories && data.animal_categories.map((category, index) => (
                            <button className="btn mx-3" key={index}>{category.category}</button>
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
