import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Edit from '../assets/edit.svg';
import Trash from '../assets/trash.svg';
import api from '../services/api';
import './DashboardAbrigo.css';

function DashboardAbrigo() {
    const { id } = useParams();
    const [itens, setItens] = useState([]);
    const [novoItem, setNovoItem] = useState({
        nome: '',
        quantidade: '',
        categoria: '',
        abrigoId: id
    });
    const [showModal, setShowModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState('id');
    const [searchValue, setSearchValue] = useState('');

    // Função assíncrona para buscar itens vinculados ao abrigo
    async function getItens() {
        try {
            const response = await api.get('/api/itens');
            const itensFiltrados = response.data.filter(item => item.abrigoId === parseInt(id));
            setItens(itensFiltrados);
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
        }
    }

    // Função assíncrona para criar um item
    async function createItem() {
        try {
            await api.post('/api/itens', novoItem);
            getItens();
            closeModal();
        } catch (error) {
            console.error('Erro ao criar item:', error);
        }
    }

    // Função assíncrona para atualizar um item
    async function updateItem() {
        try {
            await api.put(`/api/itens/${novoItem.id}`, novoItem);
            getItens();
            closeModal();
        } catch (error) {
            console.error(`Erro ao atualizar item com ID ${novoItem.id}:`, error);
        }
    }

    // Função assíncrona para deletar um item
    async function deleteItem(id) {
        try {
            await api.delete(`/api/itens/${id}`);
            getItens();
        } catch (error) {
            console.error(`Erro ao deletar item com ID ${id}:`, error);
        }
    }

    // Função para abrir o modal de adição/edição de item
    function openModal(item = { id: null, nome: '', quantidade: '', categoria: '', abrigoId: id }) {
        setNovoItem(item);
        setShowModal(true);
    }

    // Função para fechar o modal
    function closeModal() {
        setShowModal(false);
        setNovoItem({ id: null, nome: '', quantidade: '', categoria: '', abrigoId: id });
    }

    // Função para lidar com a mudança nos campos do formulário
    function handleChange(event) {
        const { name, value } = event.target;
        setNovoItem({ ...novoItem, [name]: value });
    }

    // Função para lidar com o envio do formulário
    async function handleSubmit(event) {
        event.preventDefault();
        if (novoItem.id) {
            await updateItem();
        } else {
            await createItem();
        }
    }

    // Função para lidar com a submissão do formulário de pesquisa
    async function handleSearch(event) {
        event.preventDefault();
        try {
            const response = await api.get('/api/itens', {
                params: {
                    [searchCriteria]: searchValue,
                    abrigoId: id
                }
            });
            setItens(response.data); // Atualiza os itens com o resultado da pesquisa
            setShowSearchModal(false); // Fecha o modal após a pesquisa
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
        }
    }

    // Efeito para carregar os itens ao montar o componente ou ao mudar o ID do abrigo
    useEffect(() => {
        getItens();
    }, [id]);

    return (
        <div className="dashboard-container">
            <h2>Itens do Abrigo</h2>
            <div className="button-container">
                <button onClick={() => openModal()}>Adicionar Item</button>
                <button onClick={() => setShowSearchModal(true)}>Pesquisar</button>
            </div>
            <table className="itens-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {itens.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nome}</td>
                            <td>{item.quantidade}</td>
                            <td>{item.categoria}</td>
                            <td>
                                <button className='icon-button' onClick={() => openModal(item)}>
                                    <img src={Edit}/>
                                </button>
                                <button className='icon-button' onClick={() => deleteItem(item.id)}>
                                <img src={Trash}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {itens.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>Nenhum item encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal para adicionar/editar item */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h3>{novoItem.id ? 'Editar Item' : 'Adicionar Item'}</h3>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Nome:
                                <input
                                    type="text"
                                    name="nome"
                                    value={novoItem.nome}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Quantidade:
                                <input
                                    type="number"
                                    name="quantidade"
                                    value={novoItem.quantidade}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Categoria:
                                <input
                                    type="text"
                                    name="categoria"
                                    value={novoItem.categoria}
                                    onChange={handleChange}
                                />
                            </label>
                            <button type="submit">Salvar</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para pesquisa */}
            {showSearchModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowSearchModal(false)}>&times;</span>
                        <h3>Pesquisar Itens</h3>
                        <form onSubmit={handleSearch}>
                            <label>
                                Critério de Busca:
                                <select name="criteria" value={searchCriteria} onChange={(e) => setSearchCriteria(e.target.value)}>
                                    <option value="id">ID</option>
                                    <option value="nome">Nome</option>
                                    <option value="quantidade">Quantidade</option>
                                    <option value="categoria">Categoria</option>
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
    );
}

export default DashboardAbrigo;
