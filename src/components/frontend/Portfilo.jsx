import Header from "../common/Header";

import Common from "../common/Common";

import Protflio from '../../assets/images/construction122.jpg';
import Footer from "../common/Footer";



const Portfilo = () => {
    return (
        < >
            <Header />
            <div className="mx-5 mt-4">

                <main>
                    <Common preHeading='Quality,Integrity,Value'
                        heading='Our Fortfilo'
                        text='We execd at transforming visions into ready <br />
                        through outstanding and precise'/>

                    <section className='section-6 bg-light py-5'>
                        <div className='container'>
                            <div className="row d-flex align-items-center px-4">
                                <div className="col-md-6 ">
                                    <img src={Protflio} alt="here visible image" className="w-100 rounded-2" />
                                </div>

                                <div className="col-md-6">
                                    <h2 className="text-center mb-4 text-warning">About Our Company</h2>
                                    <p className="px-4">
                                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32
                                    </p>
                                </div>
                            </div>
                        </div>

                    </section>

                </main>

            </div>

            <Footer/>
        </>
    )
}

export default Portfilo;
