import axios from "axios";
import React, { useEffect, useState } from "react"
import useCategories from "../../custom/useCategories";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Create() {
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [category_id, setCategoryId] = useState(""); 
    const [categories, setCategories] = useState([]); 
    const [errors, setErrors] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    
    useEffect(() => {
      fetchCategories()
    }, []);

    const formSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      const task = {
        title: title,
        body: body,
        category_id: category_id
      };
      try {
        await axios.post('/api/tasks', task);
        setLoading(false);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your task has been saved',
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/');
      } catch (error) {
        setLoading(false);
        setErrors(error.response.data.errors);
      }
    }

    const fetchCategories = async () => {
      const fetchedCategories = await useCategories();
      setCategories(fetchedCategories);
    }

    const renderErrors = (field) => (
      errors?.[field]?.map((error, index) => (
        <div key={index} className="text-white my-2 rounded p-2 bg-danger">
          {error}
        </div>
      ))
    )

    return (
      <div className="row my-5">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="text-center mt-2">
                Create new Prodact
              </h5>
            </div>
            <div className="card-body">
              <form className="mt-5" onSubmit={(e) => formSubmit(e)}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">The_prodact</label>
                    <input 
                      type="text" 
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="form-control" 
                      placeholder="Name" />
                      {renderErrors('title')}
                </div>
                <div className="mb-3">
                    <label htmlFor="body" className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      name="body" 
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Description"
                      rows="3"></textarea>
                      {renderErrors('body')}
                </div>
                <div className="mb-3">
                    <label htmlFor="category_id" className="form-label">Category</label>
                    <select 
                        name="category_id" 
                        onChange={(e) => setCategoryId(e.target.value)}
                        value={category_id}
                        className="form-select">
                      <option value="" disabled>Choose a category</option>
                      {
                        categories?.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))
                      }
                    </select>
                    {renderErrors('category_id')}
                </div>
                <div className="mb-3">
                  {
                    loading ? 
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      :
                      <button
                          type="submit" 
                          style={{
                              border: 'none',
                              color: '#fff',
                              backgroundImage: 'linear-gradient(30deg, #FF3333, #fdd55b)', // Adjust gradient colors
                              borderRadius: '20px',
                              backgroundSize: '100% auto',
                              fontFamily: 'inherit',
                              fontSize: '17px',
                              padding: '0.6em 1.5em',
                          }}>
                          Create
                      </button>

                  }
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
}
