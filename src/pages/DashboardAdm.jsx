import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import Edit from '../assets/edit.svg';
import Trash from '../assets/trash.svg';
import Add from '../assets/add.svg';
import Remove from '../assets/remove.svg';
import api from '../services/api';
import './DashboardAdm.css';
import Loading from './Load';

function DashboardItens() {
    const [nomeAbrigo, setNomeAbrigo] = useState('');
    const { id } = useParams();
    const [itens, setItens] = useState([]);
    const [novoItem, setNovoItem] = useState({
        id: null,
        nome: '',
        quantidade: '',
        categoria: '',
        abrigoId: Number(id)
    });
    const [showModal, setShowModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [searchCriteria, setSearchCriteria] = useState('id');
    const [searchValue, setSearchValue] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [duplicateItem, setDuplicateItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false); // Modal de edição
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false); 

    const categorias = [
        { value: 'alimentos', label: 'Alimentos' },
        { value: 'bebidas', label: 'Bebidas' },
        { value: 'brinquedos', label: 'Brinquedos' },
        { value: 'cosmeticos', label: 'Cosméticos' },
        { value: 'eletronicos', label: 'Eletrônicos' },
        { value: 'ferramentas', label: 'Ferramentas' },
        { value: 'higiene', label: 'Higiene' },
        { value: 'moveis', label: 'Móveis' },
        { value: 'roupas', label: 'Roupas' }
    ];
    const [showIncrementModal, setShowIncrementModal] = useState(false); // Modal de incremento
    const [itemToIncrement, setItemToIncrement] = useState({ id: null, nome: '', quantidade: 0 });
    const [itemToDecrement, setItemToDecrement] = useState({ id: null, nome: '', quantidade: 0, quantidadeDecrement: 0, totalQuantidade: 0 });
    const [showDecrementModal, setShowDecrementModal] = useState(false);

    // Função para obter e decodificar o token JWT
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIsAdmin(decodedToken.isAdmin);
        }
    }, []);
   
    async function getItens() {
        setLoading(true); // Ativa o Loading antes de fazer a requisição
        try {
            const response = await api.get('/itens');
            const itensFiltrados = response.data.itens.filter(item => item.abrigoId === parseInt(id));
            setItens(itensFiltrados);
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
        } finally {
            setLoading(false); // Desativa o Loading após a requisição
        }
    }

    async function getAbrigoDetails() {
        try {
            const response = await api.get(`/abrigos/${id}`);
            setNomeAbrigo(response.data.abrigo.nome);
        } catch (error) {
            console.error('Erro ao buscar detalhes do abrigo:', error);
        }
    }

    async function createItem() {
        try {
            const itemExistente = itens.find(item => item.nome.toLowerCase() === novoItem.nome.toLowerCase());
            if (itemExistente) {
                setDuplicateItem(itemExistente);
                setShowModal(false);
                setShowEditModal(true);
                return;
            }
            await api.post('/itens', { 
                nome: novoItem.nome,
                quantidade: Number(novoItem.quantidade),
                categoria: novoItem.categoria,
                abrigoId: Number(novoItem.abrigoId)
            });
            getItens();
            closeModal();
        } catch (error) {
            console.error('Erro ao criar item:', error);
        }
    }

    async function updateItem() {
        try {
            await api.put(`/itens/${novoItem.id}`, {
                ...novoItem,
                quantidade: Number(novoItem.quantidade),
                abrigoId: Number(novoItem.abrigoId)
            });
            getItens();
            closeModal();
        } catch (error) {
            console.error(`Erro ao atualizar item com ID ${novoItem.id}:`, error);
        }
    }

    async function deleteItemConfirmed(itemId) {
        try {
            const doacoesResponse = await api.get(`/doacoes/${itemId}`);
            const doacoes = doacoesResponse.data;
            if (doacoes.length > 0) {
                for (const doacao of doacoes) {
                    await api.delete(`/doacoes/${doacao.id}`);
                }
            }
            await api.delete(`/itens/${itemId}`);
            getItens();
            setShowDeleteModal(false);
        } catch (error) {
            console.error(`Erro ao deletar item com ID ${itemId}:`, error);
        }
    }

    function openModal(item = { id: null, nome: '', quantidade: '', categoria: '', abrigoId: id }) {
        setNovoItem({ ...item, abrigoId: Number(id) });
        setShowModal(true);
        setDuplicateItem(null);
    }

    function closeModal() {
        setShowModal(false);
        setNovoItem({
            id: null,
            nome: '',
            quantidade: '',
            categoria: '',
            abrigoId: Number(id)
        });
        setErrors({});
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setNovoItem({ 
            ...novoItem, 
            [name]: name === 'quantidade' ? Number(value) : value 
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        if (validateForm()) {
            if (novoItem.id) {
                await updateItem();
            } else {
                await createItem();
            }
            setIsSubmitting(false);
        } else {
            setIsSubmitting(false);
        }
    }

    async function handleSearch(event) {
        event.preventDefault();
        try {
            const response = await api.get('/itens');
            const itensFiltrados = response.data.itens.filter(item => {
                if (item.abrigoId !== parseInt(id)) {
                    return false;
                }
                if (searchCriteria === 'id') {
                    return item.id === parseInt(searchValue);
                } else if (searchCriteria === 'nome') {
                    return item.nome.toLowerCase().includes(searchValue.toLowerCase());
                } else if (searchCriteria === 'categoria') {
                    return item.categoria.toLowerCase().includes(searchValue.toLowerCase());
                }
                return false;
            });
            setItens(itensFiltrados);
            setShowSearchModal(false);
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
        }
    }

    function validateForm() {
        let formErrors = {};
        if (!novoItem.nome) formErrors.nome = "Nome é obrigatório";
        if (!novoItem.quantidade) formErrors.quantidade = "Quantidade é obrigatória";
        if (!novoItem.categoria) formErrors.categoria = "Categoria é obrigatória";
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    }

    useEffect(() => {
        getItens();
        getAbrigoDetails();
    }, [id]);

    function closeEditModal() {
        setShowEditModal(false);
    }

    function confirmEdit() {
        setNovoItem({ ...duplicateItem });
        setShowModal(true);
        setShowEditModal(false);
    }

    function openDeleteModal(item) {
        setDeleteItem(item);
        setShowDeleteModal(true);
    }

    function closeDeleteModal() {
        setShowDeleteModal(false);
        setDeleteItem(null);
    }
    // Função para abrir o modal de incremento
    function openIncrementModal(item) {
        setItemToIncrement(item);
        setShowIncrementModal(true);
    }
    function openDecrementModal(item) {
        setItemToDecrement({ ...item, quantidadeDecrement: 0, totalQuantidade: item.quantidade });
        setShowDecrementModal(true);
    }
    // Função para fechar o modal de incremento
    function closeIncrementModal() {
        setShowIncrementModal(false);
        setItemToIncrement({ id: null, nome: '', quantidade: 0 });
    }
    function closeDecrementModal() {
        setShowDecrementModal(false);
        setItemToDecrement({ id: null, nome: '', quantidade: 0, quantidadeDecrement: 0, totalQuantidade: 0 });
    }
    
    // Função para incrementar a quantidade do item
    async function incrementItemQuantity() {
        try {
            await api.put(`/itens/${itemToIncrement.id}/incremento`, {
                quantidade: Number(itemToIncrement.quantidade)
            });
            getItens();
            closeIncrementModal();
        } catch (error) {
            console.error('Erro ao incrementar quantidade do item:', error);
        }
    }
    async function decrementItemQuantity() {
        try {
            await api.put(`/itens/${itemToDecrement.id}/decremento`, {
                quantidade: Number(itemToDecrement.quantidadeDecrement)
            });
            getItens();
            closeDecrementModal();
        } catch (error) {
            console.error('Erro ao decrementar quantidade do item:', error);
        }
    }
    
    // Função para manipular a mudança na quantidade do item
    function handleIncrementChange(event) {
        const { value } = event.target;
        setItemToIncrement({
            ...itemToIncrement,
            quantidade: value
        });
    }
    function handleDecrementChange(event) {
        const { value } = event.target;
        setItemToDecrement(prevState => ({
            ...prevState,
            quantidadeDecrement: Number(value),
            totalQuantidade: prevState.quantidade - Number(value)
        }));
    }
    
    
    return (
        <div className="dashboard-container">
            <h2>Abrigo {nomeAbrigo}</h2>
            
                <div className="button-group">
                    {isAdmin && (
                        <button onClick={() => openModal()}>Adicionar Item</button>
                    )}
            
                    <button onClick={() => setShowSearchModal(true)}>Buscar Item</button>
                    <button onClick={() => getItens()}>Mostrar Tudo</button>
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
                                <button className="icon-button" onClick={() => openIncrementModal(item)}>
                                    <img src={Add} alt="Adicionar" />
                                </button>
                                <button className="icon-button" onClick={() => openDecrementModal(item)}>
                                    <img src={Remove} alt="Decrementar" />
                                </button>
                                {isAdmin && (
                                    <>
                                        <button className="icon-button" onClick={() => openModal(item)}>
                                            <img src={Edit} alt="Editar" />
                                        </button>
                                        <button className="icon-button" onClick={() => openDeleteModal(item)}>
                                            <img src={Trash} alt="Excluir" />
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && <Loading />}
            {showModal && (
            <div className="modal">
                <div className="modal-content">
                    <h3>{novoItem.id ? 'Editar Item' : 'Adicionar Item'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nome" className="label-abrigo">Nome:</label>
                            <input 
                                type="text" 
                                id="nome" 
                                name="nome" 
                                className="input-abrigo"
                                value={novoItem.nome} 
                                onChange={handleChange} 
                            />
                            {errors.nome && <span className="error">{errors.nome}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantidade" className="label-abrigo">Quantidade:</label>
                            <input 
                                type="number" 
                                id="quantidade" 
                                name="quantidade" 
                                className="input-abrigo"
                                value={novoItem.quantidade} 
                                onChange={handleChange} 
                            />
                            {errors.quantidade && <span className="error">{errors.quantidade}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="categoria" className="label-abrigo">Categoria:</label>
                            <select 
                                id="categoria" 
                                name="categoria" 
                                className="select-abrigo"
                                value={novoItem.categoria} 
                                onChange={handleChange}
                            >
                                <option value="">Selecione uma categoria</option>
                                {categorias.map(categoria => (
                                    <option key={categoria.value} value={categoria.value}>
                                        {categoria.label}
                                    </option>
                                ))}
                            </select>
                            {errors.categoria && <span className="error">{errors.categoria}</span>}
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={closeModal}>Cancelar</button>
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {showSearchModal && (
            <div className="modal">
                <div className="modal-content">
                    <h3>Buscar Item</h3>
                    <form onSubmit={handleSearch}>
                        <div className="form-group">
                            <label htmlFor="searchCriteria" className="label-abrigo">Critério de Busca:</label>
                            <select 
                                id="searchCriteria" 
                                className="select-abrigo"
                                value={searchCriteria} 
                                onChange={e => setSearchCriteria(e.target.value)}
                            >
                                <option value="id">ID</option>
                                <option value="nome">Nome</option>
                                <option value="categoria">Categoria</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="searchValue" className="label-abrigo">Valor de Busca:</label>
                            <input 
                                type="text" 
                                id="searchValue" 
                                className="input-abrigo"
                                value={searchValue} 
                                onChange={e => setSearchValue(e.target.value)} 
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={() => setShowSearchModal(false)}>Cancelar</button>
                            <button type="submit">Buscar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        {showIncrementModal && (
            <div className="modal">
                <div className="modal-content">
                    <h3>Incrementar Quantidade do Item</h3>
                    <form onSubmit={(e) => { e.preventDefault(); incrementItemQuantity(); }}>
                        <div className="form-group">
                            <label htmlFor="quantidadeIncrement" className="label-abrigo">Quantidade a Adicionar: {itemToIncrement.quantidade}</label>
                            <input 
                                type="number" 
                                id="quantidadeIncrement" 
                                name="quantidadeIncrement" 
                                className="input-abrigo"
                                value={itemToIncrement.quantidade}
                                onChange={handleIncrementChange}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={closeIncrementModal}>Cancelar</button>
                            <button type="submit">Incrementar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        {showDecrementModal && (
            <div className="modal">
                <div className="modal-content">
                    <h3>Decrementar Quantidade do Item</h3>
                    <form onSubmit={(e) => { e.preventDefault(); decrementItemQuantity(); }}>
                        <div className="form-group">
                            <label htmlFor="quantidadeDecrement" className="label-abrigo">Quantidade Atual: {itemToDecrement.quantidade}</label>
                            <input 
                                type="number" 
                                id="quantidadeDecrement" 
                                name="quantidadeDecrement" 
                                className="input-abrigo"
                                value={itemToDecrement.quantidadeDecrement}
                                onChange={handleDecrementChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="totalQuantidade" className="label-abrigo">Quantidade Restante: {itemToDecrement.totalQuantidade}</label>
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={closeDecrementModal}>Cancelar</button>
                            <button type="submit">Decrementar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {showDeleteModal && (
            <div className="modal">
                <div className="modal-content">
                    <h3>Confirmar Exclusão</h3>
                    <p>Tem certeza que deseja excluir o item {deleteItem.nome}?</p>
                    <div className="form-actions">
                        <button type="button" onClick={closeDeleteModal}>Cancelar</button>
                        <button type="button" onClick={() => deleteItemConfirmed(deleteItem.id)}>Excluir</button>
                    </div>
                </div>
            </div>
        )}

        {showEditModal && (
            <div className="modal">
                <div className="modal-content">
                    <h3>Item Duplicado</h3>
                    <p>O item "{duplicateItem.nome}" já existe. Deseja editar esse item?</p>
                    <div className="form-actions">
                        <button type="button" onClick={closeEditModal}>Cancelar</button>
                        <button type="button" onClick={confirmEdit}>Editar</button>
                    </div>
                </div>
            </div>
        )}
   
    </div>
);

}

export default DashboardItens;
