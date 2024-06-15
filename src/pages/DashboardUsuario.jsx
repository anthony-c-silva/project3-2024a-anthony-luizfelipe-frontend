import React, {useState, useEffect, useRef} from 'react'
import './DashboardUsuario.css'
import api from '../services/api.js'

function DashboardUsuario() {
    const [abrigos, setAbrigos] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [novoAbrigo, setNovoAbrigo] = useState({
        nome: '',
        localizacao: ''
    });

    const inputNome = useRef();
    const inputLocalizacao = useRef();

    // Função assíncrona para mostrar abrigos
    async function getAbrigos() {
        try {
            const response = await api.get('/api/abrigos');
            setAbrigos(response.data);
        } catch (error) {
            console.error('Erro ao buscar abrigos:', error);
        }
    }

    // Função assíncrona para criar um abrigo
    async function createAbrigo() {
        try {
            await api.post('/api/abrigos', {
                nome: novoAbrigo.nome,
                localizacao: novoAbrigo.localizacao,
            });
            getAbrigos();
            closeModal();
        } catch (error) {
            console.error('Erro ao criar abrigo:', error);
        }
    }

    // Função assíncrona para atualizar um abrigo
    async function updateAbrigo() {
        try {
            await api.put(`/api/abrigos/${novoAbrigo.id}`, {
                nome: novoAbrigo.nome,
                localizacao: novoAbrigo.localizacao,
            });
            getAbrigos();
            closeModal();
        } catch (error) {
            console.error(`Erro ao atualizar abrigo com ID ${novoAbrigo.id}:`, error);
        }
    }

    // Função assíncrona para deletar um abrigo
    async function deleteAbrigo(id) {
        try {
            await api.delete(`/api/abrigos/${id}`);
            getAbrigos();
        } catch (error) {
            console.error(`Erro ao deletar abrigo com ID ${id}:`, error);
        }
    }


    // Função assíncrona para buscar um abrigo pelo ID
    async function getAbrigoById(id) {
        try {
            const response = await api.get(`/api/abrigos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar abrigo com ID ${id}:`, error);
        }
    }

    // Função para abrir o modal de adição/edição de abrigo
    function openModal(abrigo = { id: null, nome: '', localizacao: '' }) {
        setNovoAbrigo(abrigo);
        setShowModal(true);
    }

    // Função para fechar o modal
    function closeModal() {
        setShowModal(false);
        setNovoAbrigo({ id: null, nome: '', localizacao: '' });
    }

    // Função para lidar com a mudança nos campos do formulário
    function handleChange(event) {
        const { name, value } = event.target;
        setNovoAbrigo({ ...novoAbrigo, [name]: value });
    }

    // Função para lidar com o envio do formulário
    async function handleSubmit(event) {
        event.preventDefault();
        if (novoAbrigo.id) {
            await updateAbrigo();
        } else {
            await createAbrigo();
        }
    }
    

    useEffect(() => {
        getAbrigos()
      }, [])  

    return (
        <>
            <div className="dashboard-container">
                <h2>Lista de Abrigos</h2>
                <button onClick={() => openModal()}>Adicionar Abrigo</button>
                <table className="abrigos-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Localização</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {abrigos.map(abrigo => (
                            <tr key={abrigo.id}>
                                <td>{abrigo.id}</td>
                                <td>{abrigo.nome}</td>
                                <td>{abrigo.localizacao}</td>
                                <td>
                                    <button onClick={() => openModal(abrigo)}>Editar</button>
                                    <button onClick={() => deleteAbrigo(abrigo.id)}>Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h3>{novoAbrigo.id ? 'Editar Abrigo' : 'Adicionar Abrigo'}</h3>
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Nome:
                                    <input
                                        type="text"
                                        name="nome"
                                        value={novoAbrigo.nome}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    Localização:
                                    <input
                                        type="text"
                                        name="localizacao"
                                        value={novoAbrigo.localizacao}
                                        onChange={handleChange}
                                    />
                                </label>
                                <button type="submit">Salvar</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}


export default DashboardUsuario;