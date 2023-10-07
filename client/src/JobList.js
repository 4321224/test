import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './JobList.css'; 

const JobList = () => {
   const [jobs, setJobs] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [locationTerm, setLocationTerm] = useState('');
   const [fullTimeOnly, setFullTimeOnly] = useState(false);

   useEffect(() => {
      const fetchJobs = async () => {
         try{
            const response = await axios.get('http://localhost:3000/api/jobs');
            const { jobs } = response.data;

            let filteredJobs = jobs.filter((job) =>
               job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
               job.location.toLowerCase().includes(locationTerm.toLowerCase())
            );

            if (fullTimeOnly) {
               filteredJobs = filteredJobs.filter((job) =>
                  job.type === 'Full Time'
               );
            }

             setJobs(filteredJobs);
          } catch (error) {
             console.error('Error fetching jobs:', error);
          }
       };

      fetchJobs();
    }, [searchTerm, locationTerm, fullTimeOnly]);

    return (
      <div className="job-list">
         <h2>Job List</h2>
         <form className="job-search-form">
           <div className="job-search-inputs">
              <input
                 type="text"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search by job description"
              />
              <input
                 type="text"
                 value={locationTerm}
                 onChange={(e) => setLocationTerm(e.target.value)}
                 placeholder="Search by location"
              />
           </div>
           <label>
             Full Time Only:
             <input
                type="checkbox"
                checked={fullTimeOnly}
                onChange={(e) => setFullTimeOnly(e.target.checked)}
                className="filter-checkbox"
             />
           </label>
        {/* Search button */}
        <button type='submit'>Search</button>

         </form>
         

        {}
        <table>
          <thead>
             <tr>
                {}
                <th>Title</th> 
                {}
             </tr>
          </thead>

          <tbody>
             {jobs.map((job) => (
                <tr key={job._id}>
                   {}
                   <td><Link to={`/job/${job._id}`}>{job.title}</Link></td> 
                   {}
                </tr>
              ))}
           </tbody>

        </table>

     </div>);
};

export default JobList;

