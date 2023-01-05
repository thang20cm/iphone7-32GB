import logo from './logo.svg';
import './App.css';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useState,useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';



//https://hebufedspceuwirrtzhk.supabase.co/storage/v1/object/public/images/4dbc9909-0f67-43a6-b9e0-818901652b93/ada80f4c-657c-4799-9d61-f930284ff725

const CDNURL ="https://hebufedspceuwirrtzhk.supabase.co/storage/v1/object/public/images/";

//CDNURL + user.id

function App() {
const [email,setEmail]=useState(true);
const [images,setImages] = useState([]);
const user = useUser();
const supabase = useSupabaseClient();
console.log(email);

async function getImages(){
  const {data,error}=await supabase
  .storage
  .from('images')
  .list(user?.id+"/",{
    limit:100,
    offset:0,
    sortBy:{column:"name",order:"asc"}
  });
  //[hinh1,hinh2,hinh3]
  //[hinh1]: {name:"cc.png"}

  //to load hinh1:CDNURL.
  if(data!==null){
      setImages(data);
  }else{
    alert("Error load images");
    console.log(error);
  }
}
useEffect(()=>{
  if(user){
      getImages();
  }
},[user]);

async function magicLinkLogin(){
  const{data,error}=await supabase.auth.signInWithOtp({
    email:email
  });
  if(error){
    alert("Hay dung dia chi email that!");
    console.log(error);
  }
  else{
    alert("Kiem tra thu trong email de xac thuc dang nhap");
  }
}

async function signOut(){
  const {error} =await supabase.auth.signOut();
}

async function uploadImage(e){
  let file = e.target.files[0];

  //userid:Cooper
  //Cooper/
  //Cooper/myNameOfImage.png
  //Lindsay/myNameOfImage.png

  const {data,error}=await supabase
  .storage
  .from('images')
  .upload(user.id+"/"+ uuidv4(),file) //Cooper/uuid, cc.png->cc.png

  if(data){
    getImages();
  }else{
    console.log(error);
  }
}

async function deleteImage(imageName){
  const {error} = await supabase
  .storage
  .from('images')
  .remove([user.id+"/"+imageName])

  if(error){
    alert(error);
  }
  else{
    getImages();
  }
}


  return (
    <Container align="center" className="Container-sm mt-4">
      {

      }
      {user==null?
      <>
        <h1>HELLO</h1>
        <Form>
          <Form.Group className="mb-3" style={{maxWidth:"500px"}}>
              <Form.Label>Điền Email của bạn</Form.Label>
              <Form.Control
              type="email"
              placeholder="Nhap Email"
              onChange={(e)=>setEmail(e.target.value)}
              />
          </Form.Group>
          <Button variant="primary" onClick={()=>magicLinkLogin()}>
            Đăng nhập
          </Button>
        </Form>
      </>
      :
      <>
        <h1>
          Hình của bạn
        </h1>
        <Button onClick={() =>signOut()}>Đăng xuất</Button>
        <p>Người dùng hiện tại:{user.email}</p>
        <p>Nhấp vào ô dưới để tải lên ảnh</p>
        <Form.Group className="mb-3" style={{maxWidth:"500px"}}>
          <Form.Control type="file" accept="image/*" onChange={(e)=>uploadImage(e)}/>
        </Form.Group>

        <hr/>
        <h3>Hình của bạn nè</h3>
        {

        }
      
        <Row xs={1} md={3} className="g-4">
          {images.map((image)=>{
            return(
            
              <Col key={CDNURL + user.id + "/" +image.name}>
                <Card>
                <div>
                    
                          <Card.Img variant="top" src={CDNURL + user.id+"/" +image.name}/>
                            <Card.Body>
                              <Button variant="danger" onClick={()=>deleteImage(image.name)}>Xóa</Button>
                            </Card.Body>
                    
                  </div>
                </Card>
              </Col>
             
            )
          })}
        </Row>
      </>
      }
    </Container>
  );
}

export default App;
