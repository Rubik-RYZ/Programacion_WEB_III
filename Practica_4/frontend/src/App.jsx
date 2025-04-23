
import "../src/App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { useCallback, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Swal from "sweetalert2"
import { CiEdit } from "react-icons/ci"
import { MdDeleteForever } from "react-icons/md"

function App() {
  // Estado para almacenar las guitarras
  const [guitars, setGuitars] = useState([])

  // Estado para el formulario de agregar
  const [formularioAgregar, setAgregarGuitar] = useState({
    name: "",
    price: "",
    stock: "",
  })

  // Estado para el formulario de editar
  const [formularioEditar, setEditarGuitar] = useState({
    name: "",
    price: "",
    stock: "",
  })

  const [guitarId, setGuitarId] = useState(null)
  const [busqueda, setBusqueda] = useState("")

  // Estados para controlar los modales
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const [mostrar, setMostrar] = useState(false)
  const cerrarModal = () => setMostrar(false)
  const abrirModal = () => setMostrar(true)

  // Función para obtener todas las guitarras
  const fetchGuitars = useCallback(async () => {
    try {
      const respuesta = await fetch("http://localhost:3001/api/guitars")
      const data = await respuesta.json()

      // Normalizar los nombres de las propiedades (convertir Name a name, etc.)
      const normalizedData = data.map((guitar) => ({
        id: guitar.id || guitar["id"],
        name: guitar.name || guitar["Name"] || "",
        price: guitar.price || guitar["Price"] || 0,
        stock: guitar.stock || guitar["Stock"] || 0,
      }))

      setGuitars(normalizedData)
    } catch (error) {
      console.error("Error al obtener guitarras:", error)
    }
  }, [])

  useEffect(() => {
    fetchGuitars()
  }, [fetchGuitars])

  // Función para agregar una nueva guitarra
  const agregarGuitar = async (e) => {
    e.preventDefault()
    if (!formularioAgregar.name.trim()) {
      alert("Nombre requerido")
      return
    }

    try {
      const respuesta = await fetch(`http://localhost:3001/api/guitars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formularioAgregar.name,
          price: Number(formularioAgregar.price),
          stock: Number(formularioAgregar.stock),
        }),
      })

      handleClose()
      Swal.fire({
        title: "¡Se agregó correctamente la guitarra!",
        icon: "success",
        timer: 2000,
      })

      setAgregarGuitar({
        name: "",
        price: "",
        stock: "",
      })

      fetchGuitars()
    } catch (error) {
      console.error(error)
      Swal.fire({
        title: "¡No se pudo agregar la nueva guitarra!",
        icon: "error",
        timer: 2000,
      })
    }
  }

  // Manejar cambios en el formulario de agregar
  const cambiosFormularioAgregar = (e) => {
    setAgregarGuitar({
      ...formularioAgregar,
      [e.target.name]: e.target.value,
    })
  }

  // Preparar datos para editar
  const editarGuitarModal = (guitar) => {
    setEditarGuitar({
      name: guitar.name,
      price: guitar.price,
      stock: guitar.stock,
    })
    setGuitarId(guitar.id)
    abrirModal()
  }

  // Manejar cambios en el formulario de editar
  const cambiosFormularioEditar = (e) => {
    setEditarGuitar({
      ...formularioEditar,
      [e.target.name]: e.target.value,
    })
  }

  // Función para editar una guitarra
  const editarGuitar = async (e) => {
    e.preventDefault()
    if (!formularioEditar.name.trim()) {
      alert("Nombre requerido")
      return
    }

    try {
      const respuesta = await fetch(`http://localhost:3001/api/guitars/${guitarId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formularioEditar.name,
          price: Number(formularioEditar.price),
          stock: Number(formularioEditar.stock),
        }),
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json()
        throw new Error(errorData.message || "Error al actualizar")
      }

      cerrarModal()
      Swal.fire({
        title: "¡Se editó correctamente la guitarra!",
        icon: "success",
        timer: 2000,
      })

      fetchGuitars()
    } catch (error) {
      console.error("Error al actualizar:", error)
      Swal.fire({
        title: "¡No se pudo editar la guitarra!",
        text: error.message,
        icon: "error",
        timer: 3000,
      })
    }
  }

  // Función para eliminar una guitarra
  const eliminarGuitar = async (id) => {
    Swal.fire({
      title: "¿Estás seguro de que deseas eliminar esta guitarra?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, Eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:3001/api/guitars/${id}`, {
            method: "DELETE",
          })

          Swal.fire({
            title: "¡Guitarra Eliminada Correctamente!",
            icon: "success",
            timer: 2000,
          })

          fetchGuitars()
        } catch (error) {
          console.error(error)
          Swal.fire({
            title: "¡No se pudo eliminar la guitarra!",
            icon: "error",
            timer: 2000,
          })
        }
      }
    })
  }

  // Definición de columnas para la tabla
  const columnas = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Precio",
      selector: (row) => `$${Number.parseFloat(row.price).toFixed(2)}`,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="btn-group" role="group" aria-label="Acciones">
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => {
              editarGuitarModal(row)
            }}
          >
            <CiEdit />
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              eliminarGuitar(row.id)
            }}
          >
            <MdDeleteForever />
          </button>
        </div>
      ),
    },
  ]

  const paginacionOpciones = {
    rowsPerPageText: "Filas por página",
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Gestión de Guitarras</h1>

      <div style={{ margin: "30px 0px" }}>
        <Button variant="primary" onClick={handleShow}>
          Agregar Nueva Guitarra
        </Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Buscar guitarra por nombre"
        className="mb-3"
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value)
        }}
      />

      <DataTable
        columns={columnas}
        data={guitars.filter((guitar) => guitar.name && guitar.name.toLowerCase().includes(busqueda.toLowerCase()))}
        pagination
        highlightOnHover
        striped
        paginationComponentOptions={paginacionOpciones}
        noDataComponent="No hay guitarras disponibles"
        theme="dark"
      />

      {/* Modal para Agregar nueva guitarra */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Guitarra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                name="name"
                onChange={cambiosFormularioAgregar}
                value={formularioAgregar.name}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPrice">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el precio"
                name="price"
                onChange={cambiosFormularioAgregar}
                value={formularioAgregar.price}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el stock"
                name="stock"
                onChange={cambiosFormularioAgregar}
                value={formularioAgregar.stock}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={agregarGuitar}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Editar */}
      <Modal show={mostrar} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Guitarra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="editFormName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                name="name"
                onChange={cambiosFormularioEditar}
                value={formularioEditar.name}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editFormPrice">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el precio"
                name="price"
                onChange={cambiosFormularioEditar}
                value={formularioEditar.price}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editFormStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el stock"
                name="stock"
                onChange={cambiosFormularioEditar}
                value={formularioEditar.stock}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={editarGuitar}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default App
