import axios from 'axios';
import React, { useEffect, useState } from 'react'
import useCategories from '../../custom/useCategories';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { useDebounce } from 'use-debounce';


export default function Posts() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [catId, setCatId] = useState(null);
    const [orderBy, setOrderBy] = useState(null);
    const [searchTerm , setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        if(!categories.length){
            fetchCategories();
        }
        if(!tasks.length){
            fetchTasks();
        }
    }, [page, catId, orderBy, debouncedSearchTerm[0]])


    const fetchTasks = async () => {
        let response = null;
        try {
            if(catId) {
                response = await axios.get(`/api/category/${catId}/tasks?page=${page}`);
            }else if(orderBy) {
                response = await axios.get(`api/order/${orderBy.column}/${orderBy.direction}/tasks?page=${page}`);
            }else if(debouncedSearchTerm[0] !== ''){
                response = await axios.get(`api/search/${searchTerm}/tasks?page=${page}`);
            }else{
                response = await axios.get(`/api/tasks?page=${page}`);
            }
            setTasks(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        const fetchedCategories = await useCategories();
        setCategories(fetchedCategories);
    }



    const fetchNextPrevTasks = (link) => {
        const url = new URL(link);
        setPage(url.searchParams.get('page'));
    }

    const deleteTask = async (taskId) => {
        try {
            const response = await axios.delete(`/api/tasks/${taskId}`);

            fetchTasks(); 
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };
    

    const renderPaginationLinks = () => {
        return <ul className="pagination">
            {
                tasks.links?.map((link,index) => (
                    <li key={index} className="page-item">
                        <a style={{cursor: 'pointer'}} className={`page-link ${link.active ? 'active' : ''}`} 
                            onClick={() => fetchNextPrevTasks(link.url)}>
                            {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                        </a>
                    </li>
                ))
            }
        </ul>
    }

    return (
        <div className="row my-5">
            <div className="col-md-12 card">
                <div className="row my-3">
                    <div className="col-md-9 card">
                        <div className="row my-3">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setCatId(null);
                                            setPage(1);
                                            setSearchTerm(e.target.value);
                                        }}
                                        placeholder="Search..."
                                        className="form-control rounded-0 border border-dark"
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={catId || ''}
                                    onChange={(event) => {
                                        const selectedCategoryId = event.target.value;
                                        setSearchTerm('');
                                        setPage(1);
                                        setCatId(selectedCategoryId);
                                    }}
                                >
                                    <option value="">All Category</option>
                                    {categories?.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row my-5">
                        {tasks.data?.map(task => (
                            <div className="col-md-4 mb-4" key={task.id}>
                                <div className="card" style={{ width: '18rem' }}>
                                    <div className="card-body">
                                        <h5 className="card-title">{task.title}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{task.body}</h6>
                                        <h6 className="card-subtitle mb-2 text-muted">{task.category.name}</h6>
                                        <div className="d-flex">
                                        <Link to={`edit/${task.id}`} style={{
                                                border: 'none',
                                                color: '#fff',
                                                backgroundImage: 'linear-gradient(30deg, #33FFFC, #33FFE0)', // Adjust gradient colors
                                                borderRadius: '20px',
                                                backgroundSize: '100% auto',
                                                fontFamily: 'inherit',
                                                fontSize: '17px',
                                                padding: '0.6em 1.5em',
                                                marginRight: '10px' // Add margin to create space between buttons
                                            }} className="btn btn-sm btn-warning">
                                                Edit
                                            </Link>

                                            <button
                                                style={{
                                                    border: 'none',
                                                    color: '#fff',
                                                    backgroundImage: 'linear-gradient(30deg, #FF3333, #fdd55b)', // Adjust gradient colors
                                                    borderRadius: '20px',
                                                    backgroundSize: '100% auto',
                                                    fontFamily: 'inherit',
                                                    fontSize: '17px',
                                                    padding: '0.6em 1.5em',
                                                }}
                                                onClick={() => deleteTask(task.id)}
                                            >
                                                Delete
                                            </button>
</div>


                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
    
                    <div className="my-4 d-flex justify-content-between">
                        <div>
                            Showing {tasks.from || 0} to {tasks.to || 0} from {tasks.total} results.
                        </div>
                        <div>
                            {renderPaginationLinks()}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
    
}
