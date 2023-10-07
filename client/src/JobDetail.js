import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './JobDetail.css'; 

const JobDetail = () => {
   const { id } = useParams();
   const [job, setJob] = useState(null);

   useEffect(() => {
      const fetchJobDetail = async () => {
         try{
            const response = await axios.get(`http://localhost:3000/api/jobs/${id}`);
            if (response.data.success) {
               setJob(response.data.job);
            } else{
               console.log('Job not found');
            }
         } catch (error) {
            console.error('Error fetching job details:', error);
         }
      };

      fetchJobDetail();
    }, [id]);

    if (!job) return <div>Loading...</div>;

    return (
       <div className="job-detail">
          <h2>Job Detail</h2>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
       </div>
    );
};

export default JobDetail;
