
import { useEffect, useState } from 'react';

import Footer from "../common/Footer";
import Header from "../common/Header";
import { useParams } from 'react-router-dom';


const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        fetch('/projects.json')
            .then((response) => response.json())
            .then((data) => {
                const selectedProject = data.find((proj) => proj.id === parseInt(id));
                setProject(selectedProject);
            })
            .catch((error) => console.error("Error fetching project details:", error));
    }, [id]);

    if (!project) return <div>Loading...</div>;

    return (
        <>
            <Header />
            <div className="container">
                <div className="row align-items-center p-2">
                    <div className="col-md-6">
                        <img src={project.image} alt={project.title} className="img-fluid rounded-2" />
                    </div>
                    <div className="col-md-6 px-4">
                        <h1 className="text-warning mb-2">{project.title}</h1>
                        <p>{project.description}</p>
                        <p>{project.text}</p>
                        <p><strong>Owner:</strong> {project.owner.name}</p>
                        <p><strong>Address:</strong> {project.owner.Address}</p>
                        <p><strong>Phone:</strong> {project.owner.Phone}</p>
                    </div>
                </div>
            </div>


            <Footer />
        </>
    )
}

export default ProjectDetails;
