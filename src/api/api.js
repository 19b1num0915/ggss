import * as axios from 'axios';
export default class Api {
  service = () => {
    const headers = {
      // Accept: 'application/json',
    };
    // if (Store && Store.selloToken) {
    //   headers.Authorization = `Bearer ${Store.selloToken}`;
    // }
    if (localStorage.getItem('accessToken')) {
      headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    }
    this.client = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      timeout: 100000,
      headers,
    });
    this.client.interceptors.request.use(
      function (config) {
        // Do something before request is sent
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );
    this.client.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      function (error) {
        if (error && error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.reload();
        }
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        // errorHandler(error.response);
        return Promise.reject(error);
      }
    );
    return this.client;
  };
  authService = () => {
    const headers = {
      Accept: 'application/json',
      Authorization: authenticateUser(process.env.REACT_APP_CLIENT_USERNAME_BASICAUTH, process.env.REACT_APP_CLIENT_PASSWORD_BASICAUTH),
      
    };

    this.client = axios.create({
      baseURL: process.env.REACT_APP_AUTH_BASE_URL,
      timeout: 100000,
      headers,
    });
  console.log("============>", this.client);

    return this.client;
  };
}
function authenticateUser(user, password) {
  // const token = user + ':' + password;
  const token = 'uoffice-backend:a7ab3f43-9ad2-460a-8c10-c64ef8d8ad0d';
  // const token = 'uoffice:a7ab3f43-9ad2-460a-8c10-c64ef8d8ad0d';
  // Base64 Encoding -> btoa
  const hash = btoa(token);
  
  return 'Basic ' + hash;
}

const api = new Api();

function goLogin(path, data) {
  return api
    .authService()
    // .post(`http://10.21.68.17:7080/auth/realms/unitel/protocol/openid-connect/token`, `username=${data.username}&grant_type=password&password=${data.password}`)
    .post(`http://10.21.68.17:7080/auth/realms/unitel/protocol/openid-connect/token`, `username=${data.username}&grant_type=password&password=${encodeURIComponent(data.password)}`)
    .then((user) => user);
}

function getDemoImages() {
  return api
    .service()
    .get(`https://minimal-assets-api.vercel.app/api/products/product?name=nike-air-force-1-ndestrukt`)
    .then((user) => user);
}
function getMethod(path, data) {
  const params = new URLSearchParams(data);
  return api
    .service()
    .get(`${process.env.REACT_APP_BASE_URL}${path}`, { params })
    .then((user) => user);
}

function postMethodExcel(path, data) {
  return api
    .service()
    .post(`${process.env.REACT_APP_BASE_URL}${path}`, data, { responseType: 'arraybuffer' })
    .then((user) => user);
}
function postMethod(path, data) {
  return api
    .service()
    .post(`${process.env.REACT_APP_BASE_URL}${path}`, data)
    .then((user) => user);
}

function updateMethod(path, data, id) {
  return api
    .service()
    .put(`${process.env.REACT_APP_BASE_URL}${path}/${id}`, data)
    .then((user) => user);
}

function deleteMethod(path, id) {
  return api
    .service()
    .delete(`${process.env.REACT_APP_BASE_URL}${path}/${id}`)
    .then((user) => user);
}

export const apiService = {
  goLogin,
  getDemoImages,
  postMethodExcel,
  getMethod,
  postMethod,
  updateMethod,
  deleteMethod,
};
