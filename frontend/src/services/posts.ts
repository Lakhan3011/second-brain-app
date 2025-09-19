import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export async function addContent(post: { title: string; link: string; type: string }) {
    const response = await axios.post(`${BACKEND_URL}/api/v1/content`, post, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });

    return response.data;
}


export async function fetchContents() {
    const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
    });

    return response.data.content;
}

export async function shareContents() {
    const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
        share: true,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })

    return response.data;
}


export async function fetchShareContents(hash: string) {
    const response = await axios.get(`${BACKEND_URL}/api/v1/brain/share/${hash}`);
    return response.data.content;
}

export async function deleteContent(contentId: string) {
    const response = await axios.delete(`${BACKEND_URL}/api/v1/content`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        data: { contentId }
    })

    return response.data;
}
