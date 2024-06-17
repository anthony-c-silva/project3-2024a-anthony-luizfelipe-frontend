import React, { useState, useEffect, useRef } from 'react';
import './DashboardAbrigo.css';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import Edit from '../assets/edit.svg';
import Trash from '../assets/trash.svg';
import View from '../assets/view.svg';

function DashboardUsuario() {
    const [abrigos, setAbrigos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [novoAbrigo, setNovoAbrigo] = useState({
        nome: '',
        localizacao: ''
    });
    const [searchCriteria, setSearchCriteria] = useState('id');
    const [searchValue, setSearchValue] = useState('');

    const navigate = useNavigate();

    const handleVisualizar = (id) => {
        navigate(`/dashboard-abrigo/${id}`);
    };

    // Função assíncrona para mostrar abrigos com opção de filtro
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

    // Função para lidar com a submissão do formulário de pesquisa
    async function handleSearch(event) {
        event.preventDefault();
        try {
            const response = await api.get('/api/abrigos');
            const abrigosFiltrados = response.data.filter(abrigo => {
                if (searchCriteria === 'id') {
                    return abrigo.id === parseInt(searchValue);
                } else if (searchCriteria === 'nome') {
                    return abrigo.nome.toLowerCase().includes(searchValue.toLowerCase());
                } else if (searchCriteria === 'localizacao') {
                    return abrigo.localizacao.toLowerCase().includes(searchValue.toLowerCase());
                }
                return false;
            });
            console.log('Abrigos encontrados:', abrigosFiltrados);
            setAbrigos(abrigosFiltrados); // Atualiza os abrigos com o resultado da pesquisa
            setShowSearchModal(false); // Fecha o modal após a pesquisa
        } catch (error) {
            console.error('Erro ao buscar abrigos:', error);
        }
    }

    useEffect(() => {
        getAbrigos();
    }, []);

    return (
        <>
            <div className="dashboard-container">
                <h2>Lista de Abrigos</h2>
                <div className="button-container">
                    <button onClick={() => openModal()}>Adicionar Abrigo</button>
                    <button onClick={() => setShowSearchModal(true)}>Pesquisar</button>
                    <button onClick={() => getAbrigos()}>Mostrar Tudo</button>
                </div>
                <table className="itens-table">
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
                                    <button className='icon-button' onClick={() => openModal(abrigo)}>
                                        <img src={Edit}/>
                                    </button>
                                    <button className='icon-button' onClick={() => deleteAbrigo(abrigo.id)}>
                                        <img src={Trash}/>
                                    </button>
                                    <button className='icon-button' onClick={() => handleVisualizar(abrigo.id)}>
                                        <img src={View}/>
                                    </button>
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

                {showSearchModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowSearchModal(false)}>&times;</span>
                            <h3>Pesquisar Abrigos</h3>
                            <form onSubmit={handleSearch}>
                                <label>
                                    Critério de Busca:
                                    <select name="criteria" value={searchCriteria} onChange={(e) => setSearchCriteria(e.target.value)}>
                                        <option value="id">ID</option>
                                        <option value="nome">Nome</option>
                                        <option value="localizacao">Localização</option>
                                    </select>
                                </label>
                                <label>
                                    Valor:
                                    <input
                                        type="text"
                                        name="searchValue"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                </label>
                                <button type="submit">Pesquisar</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default DashboardUsuario;
