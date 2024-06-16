import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api.js';
import './DashboardAbrigo.css'

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

    useEffect(() => {
        getItens();
    }, [id]);

    return (
        <div className="dashboard-container">
            <h2>Itens do Abrigo</h2>
            <button onClick={() => openModal()}>Adicionar Item</button>
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
                                <button onClick={() => openModal(item)}>Editar</button>
                                <button onClick={() => deleteItem(item.id)}>Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
        </div>
    );
}

export default DashboardAbrigo;
