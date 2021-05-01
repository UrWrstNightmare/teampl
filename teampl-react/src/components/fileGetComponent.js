import React, {useContext, useState} from 'react';
import axios from 'axios';
import {firebaseAuth} from "../providers/UserProvider";

const GetFileMetadata = (props) => {
    props.onLoad();
    console.log('Run!');
    const {metadata, setMetadata} = useContext(firebaseAuth);
    axios({
        url: 'https://api.gbshs.kr/tmpl/getFileMetadata.php?user='+props.username,
        method: 'GET'
    }).then(response=>{
        console.log(response.data);
        setMetadata({
            loading: false,
            data: response.data
        });

    }).catch(error=>{
        console.log(error);
        return null;
    });
    return null;
};

const GetFileToView = (props) => {
  props.onload(); //to STOP CALLING the script
  console.log('Downloading file for preview, will return as fileToView.file state');
  const {fileToView, setFileToView} = useContext(firebaseAuth);
  axios({
      url: 'https://api.gbshs.kr/tmpl/getFile.php?user='+props.username+"file="+props.fileName+(props.shared?"shared=true":''),
      method: "GET"
  }).then(response=>{
      props.filePath(URL.createObjectURL(response.data));
  }).catch(error=>{
      console.log(error);
      return null;
  });
  return null;
};

export default {GetFileMetadata, GetFileToView};