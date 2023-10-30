import { useEffect, useState } from "react";
import BlogPost from "../components/BlogPost";
import { deleteFetch, getFetch, putFetch } from "../services/requestServices";
import DeleteModal from "../components/Modals/DeleteModal";
import EditModal from "../components/Modals/EditModal";
import { useAuthContext } from "../hooks/useAuthContext";
const Blogs = () => {
  //Hooks
  //THIS STATE VAR HOLDS ALL OF THE BLOGS
  let [blogs, setBlogs] = useState(null);
  //THIS STATE VAR HOLDS ONLY ONE BLOG
  let [filteredBlogs, setFilteredBlogs] = useState(blogs);
  //HOOK FOR DELETE MODAL
  let [deleteModal, setDeleteModal] = useState(null);
  //HOOK FOR EDIT MODAL
  let [editModal, setEditModal] = useState(null);
  const { user } = useAuthContext();
  //Trigger for activating get fetch
  const [trigger, setTrigger] = useState(false);

  const deleteData = async (id, config) => {
    const data = await deleteFetch("http://localhost:4000/api/v1/blogs", id, config);
    console.log("DELETED ", data);
    setTrigger(!trigger);
    closeDeleteModal();
  };

  const editData = async (id, editedBlog, config) => {
    console.log(config, "Config here")
    const data = await putFetch(
      "http://localhost:4000/api/v1/blogs",
      id,
      editedBlog,
      config
    );
    console.log("UPDATED", data);
    setTrigger(!trigger);
    closeEditModal();

  };
  /**
   * THIS FUNCTION IS FOR OPENING THE DELETE MODAL
   * @param {*long} id THE ID OF THE DATA TO BE DELETED
   */
  const openDeleteModal = (id) => {
    setDeleteModal(
      <DeleteModal data={id} delete={deleteData} close={closeDeleteModal} />
    );
  };
  /**
   * THIS FUNCTION IS FOR CLOSING THE DELETE MODAL
   */
  const closeDeleteModal = () => {
    setDeleteModal(null);
  };
  /**
   *
   */
  const closeEditModal = () => {
    setEditModal(null);
  };
  /**
   * THIS FUNCTION OPENS THE EDIT MODAL
   * @param {*string} id  THE EDITED BLOGS ID
   * @param {*Blog} editedBlog THE EDITED BLOG
   */

  const openEditModal = (id, editedBlog) => {
    //console.log(id,"---",editedBlog);
    setEditModal(
      <EditModal
        data={id}
        blog={editedBlog}
        close={closeEditModal}
        edit={editData}
      />
    );
  };

  const handleChange = (e) => {
    e.preventDefault();
    setFilteredBlogs(
      blogs.filter((blog) => {
        return blog.title.toLowerCase().includes(e.target.value.toLowerCase());
      })
    );
  };
  const fetchBlogs = async (config) => {
    // REFACTOR -- USE ENV FOR LOCALHOST
    const data = await getFetch("http://localhost:4000/api/v1/blogs", config);
    setBlogs(data);
    setFilteredBlogs(data);
  };

  useEffect(() => {
    if (user) {
      const config = {
        headers: { 'Authorization': 'Bearer ' + user.token }
      }
      fetchBlogs(config);
    }
  }, [user, trigger]);

  useEffect(() => {
    if (!user) {
      setBlogs(null);
    }
  }, [user])

  return (
    <div align="center">
      <div className="container">
        <hr />
        <section className="hero is-medium">
          <div className="hero is-medium has-text-centered">
            <h5 className="title is-2" style={{ fontStyle: "italic" }}>
              M.E.R.N.Blog
            </h5>
            <div
              id="hero-input-group"
              className="field has-addons has-addons-centered"
            >
              <input
                className="input is-medium"
                type="text"
                placeholder="Search The Blogs that you want to find (Search by title)"
                onChange={handleChange}
                style={{ borderRadius: "3rem" }}
              />
            </div>
          </div>
        </section>
        <hr />
        <div className="columns is-multiline">
          {blogs &&
            filteredBlogs.map((blog) => {
              return (
                <div
                  className="column is-one-third"
                  key={blog._id}
                  style={{ fontFamily: "cursive" }}
                >
                  <div className="card" style={{ "minHeight": "30rem", "maxHeight": "50rem" }} card-shadow="1em" >
                    <div className="card-content">
                      <BlogPost
                        blog={blog}
                        openEditModal={() => openEditModal(blog._id, blog)}
                        openDeleteModal={() => openDeleteModal(blog._id)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          {!blogs && (
            <section className="section is-small">
              <div className="columns">
                <div className="content is-medium">
                  <div className="notification is-warning is-light" style={{ fontStyle: "italic" }}>
                    The data could not be loaded. Please wait. Please Login or sign up If you haven't already.
                    If the response is taking too long, please check your connection
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
      {deleteModal}
      {editModal}
    </div>
  );
};

export default Blogs;
