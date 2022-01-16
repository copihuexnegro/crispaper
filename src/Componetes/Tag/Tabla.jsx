import React ,{useState,useEffect,useContext} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import {UsuarioContext} from '../../Provedores/UsuarioContext'
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import {IconButton} from '@material-ui/core'
import { useHistory } from 'react-router';
import Swal from 'sweetalert2'
import Mostrar from './Mostrar'
import FuncionesFirebase from '../../Funciones/FuncionesFirebase'
const estilos = makeStyles((theme)=>({
  estilosDiv:{
    margin:'2px'
  }
}))

const borrarPaper=(paper)=>{
  Swal.fire({
    title: 'Estas seguro que deseas borrar?',
    text: `${paper.titulo}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async(result) => {
  
    if (result.isConfirmed) {
      await FuncionesFirebase.borrarPaper(paper)
      Swal.fire(
        'Borrado!',
        'Tu registro ha sido borrado.',
        'success'
      )
    }
  })
}

export default function BasicTable(props) {
    const [paper, setpaper] = useState([])
    const history=useHistory()
    const usuario =useContext(UsuarioContext)
    const clases =estilos()
    const [state, setState] = useState({
      region: true,
      topicoambiental: true,
      tipoinformacion:true,
      quality:true,
      descripcion:true,
    });
  
    const handleChange = (event) => {
      setState({ ...state, [event.target.name]: event.target.checked });
    };
    useEffect(() => {
      console.log('prueba de consumo')
      setpaper(props.paper)
      console.log(props.paper.length)
    }, [props])
  return (
    <div>
      <Mostrar state={state} handleChange={handleChange}  ></Mostrar>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{width:'600px'}}>Titulo</TableCell>
            {state.region&&
             <>
            <TableCell align="center">Region</TableCell>
             </>
            }
            {state.topicoambiental&&
            <TableCell align="center">Topico Ambiental</TableCell>
            }
            {state.tipoinformacion&&
            <TableCell align="center">Tipo de Informacion</TableCell>
            }
            {state.quality&&
           <TableCell align="center">Quality</TableCell>
              }
              {state.descripcion&&
            <TableCell align="center">Descripcion</TableCell>
              }
            {usuario !==null && usuario.administrador &&
            <>
            <TableCell align="center"><CreateIcon/></TableCell>
            <TableCell align="center"><DeleteIcon/></TableCell>
            </>
            }
            </TableRow>
        </TableHead>
        <TableBody>
          { 
          paper.length == 0 ?
          <TableCell component="th" scope="row">
          no hay paper
           </TableCell>
            :
          paper.map((row) => (
            <TableRow
              
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">

                { row.link !== null ?
                <a href={row.link}  target="_blank" > {row.titulo} </a>
                :
                row.pdf !== null ?
                <a href={row.pdf} target="_blank" > {row.titulo} </a>
                :
                row.titulo
                }
              </TableCell>
              {state.region && 
              <TableCell align="center">
              {row.Regiones !=undefined &&
              row.Regiones.map(doc=>(
                
                <Chip className={clases.estilosDiv} label={doc.descripcion}/> 
              ))}
              </TableCell>
              }
              {state.topicoambiental&&
              <TableCell align="center">
              {row.etiquetas!=undefined&&row.etiquetas.map(doc=>(
                
                <Chip className={clases.estilosDiv} label={doc.descripcion}/> 
              ))}
              </TableCell>
                }
                {state.tipoinformacion&&
              <TableCell align="center">
              {row.TopicoInformacion !=undefined &&
              row.TopicoInformacion.map(doc=>(
                
                <Chip className={clases.estilosDiv} label={doc.descripcion}/> 
              ))}
              </TableCell>
              }
              {state.quality&&
              <TableCell align="center">
              {row.likes}
              </TableCell>
              }
          {state.descripcion &&
              <TableCell align="center">
                {row.resumen}
              </TableCell>}
              {usuario !==null && usuario.administrador &&
              <>
              <TableCell align="right">
              <IconButton aria-label="create" className={clases.margin}>
                <CreateIcon onClick={()=>history.push(`/editarpaper/${row.id}`)} />
              </IconButton>
              </TableCell>
              <TableCell align="right"> 
              <IconButton aria-label="delete" onClick={()=>{borrarPaper(row)}} className={clases.margin}>
                <DeleteIcon  />
              </IconButton>
              </TableCell>
              </>}
            </TableRow>
          ))
          }
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
