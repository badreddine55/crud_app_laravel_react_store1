import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditTask() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [category_id, setCategoryId] = useState(0);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { taskId } = useParams();

    useEffect(() => {
        fetchTask();
        fetchCategories();
    }, []);

    const formSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const task = {
            title: title,
            body: body,
            category_id: category_id,
        };
        try {
            await axios.put(`/api/tasks/${taskId}`, task);
            setLoading(false);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your task has been updated',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/');
        } catch (error) {
            setLoading(false);
            setErrors(error.response.data.errors);
        }
    }

    const fetchTask = async () => {
        try {
            const response = await axios.get(`/api/tasks/${taskId}`);
            setTitle(response.data.title);
            setBody(response.data.body);
            setCategoryId(response.data.category_id);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/categories");
            setCategories(response.data);
        } catch (error) {
            console.log(error);
        }
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
                            Edit Product
                        </h5>
                    </div>
                    <div className="card-body">
                        <form className="mt-5" onSubmit={(e) => formSubmit(e)}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">The Product</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="form-control"
                                    placeholder="Title*" />
                                {renderErrors('title')}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="body" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    name="body"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Body*"
                                    rows="3"></textarea>
                                {renderErrors('body')}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="category_id" className="form-label">Category</label>
                                <select
                                    name="category_id"
                                    value={category_id}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="form-select">
                                    {
                                        categories.map(category => (
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
                                                backgroundImage: 'linear-gradient(30deg, #33FFFC, #33FFE0)',
                                                borderRadius: '20px',
                                                backgroundSize: '100% auto',
                                                fontFamily: 'inherit',
                                                fontSize: '17px',
                                                padding: '0.6em 1.5em',
                                                marginRight: '10px'
                                            }}>
                                            Update
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
