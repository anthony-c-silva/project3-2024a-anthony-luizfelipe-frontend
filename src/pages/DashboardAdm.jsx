import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Edit from '../assets/edit.svg';
import Trash from '../assets/trash.svg';
import api from '../services/api';
import './DashboardAdm.css';

function DashboardAbrigo() {
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

    async function getItens() {
        try {
            const response = await api.get('/itens');
            const itensFiltrados = response.data.itens.filter(item => item.abrigoId === parseInt(id));
            setItens(itensFiltrados);
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
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
            const itemExistente = itens.find(
                item => item.nome === novoItem.nome && item.categoria === novoItem.categoria
            );

            if (itemExistente) {
                setDuplicateItem(itemExistente);
                setNovoItem(prevState => ({
                    ...prevState,
                    quantidade: parseInt(prevState.quantidade) + itemExistente.quantidade
                }));
                return;
            }

            const response = await api.post('/itens', novoItem);
            setItens([...itens, response.data.item]);
            setNovoItem({ id: null, nome: '', quantidade: '', categoria: '', abrigoId: Number(id) });
            setShowModal(false);
        } catch (error) {
            console.error('Erro ao criar item:', error);
        }
    }

    async function handleDuplicateItem() {
        try {
            if (duplicateItem) {
                const response = await api.put(`/itens/${duplicateItem.id}`, novoItem);
                setItens(itens.map(item => (item.id === duplicateItem.id ? response.data.item : item)));
                setDuplicateItem(null);
            } else {
                await createItem();
            }
            setNovoItem({ id: null, nome: '', quantidade: '', categoria: '', abrigoId: Number(id) });
            setShowModal(false);
        } catch (error) {
            console.error('Erro ao atualizar item:', error);
        }
    }

    async function deleteItemById(itemId) {
        try {
            await api.delete(`/itens/${itemId}`);
            setItens(itens.filter(item => item.id !== itemId));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Erro ao deletar item:', error);
        }
    }

    async function handleSearch() {
        try {
            const response = await api.get('/itens');
            const filteredItens = response.data.itens.filter(item => {
                if (searchCriteria === 'id') {
                    return item.abrigoId === parseInt(id) && item.id === parseInt(searchValue);
                } else if (searchCriteria === 'nome') {
                    return item.abrigoId === parseInt(id) && item.nome.toLowerCase().includes(searchValue.toLowerCase());
                } else if (searchCriteria === 'categoria') {
                    return item.abrigoId === parseInt(id) && item.categoria.toLowerCase().includes(searchValue.toLowerCase());
                }
                return false;
            });
            setItens(filteredItens);
            setShowSearchModal(false);
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newErrors = {};

        if (!novoItem.nome.trim()) {
            newErrors.nome = 'O nome é obrigatório';
        }

        if (!novoItem.quantidade.trim()) {
            newErrors.quantidade = 'A quantidade é obrigatória';
        } else if (isNaN(novoItem.quantidade) || parseInt(novoItem.quantidade) <= 0) {
            newErrors.quantidade = 'A quantidade deve ser um número positivo';
        }

        if (!novoItem.categoria.trim()) {
            newErrors.categoria = 'A categoria é obrigatória';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        await handleDuplicateItem();
        setIsSubmitting(false);
    };

    useEffect(() => {
        getItens();
        getAbrigoDetails();
    }, [id]);

    return (
        <div className="dashboard-container">
            <h2>Dashboard do Abrigo: {nomeAbrigo}</h2>
            <div className="button-group">
                <button onClick={() => setShowModal(true)}>Adicionar Item</button>
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
                                <button className="icon-button" onClick={() => {
                                    setNovoItem(item);
                                    setShowModal(true);
                                }}>
                                    <img src={Edit} alt="Editar" />
                                </button>
                                <button className="icon-button" onClick={() => {
                                    setDeleteItem(item);
                                    setShowDeleteModal(true);
                                }}>
                                    <img src={Trash} alt="Deletar" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <form onSubmit={handleSubmit}>
                            <label className='label-abrigo' htmlFor="nome">Nome:</label>
                            <input
                                className='input-abrigo'
                                type="text"
                                id="nome"
                                value={novoItem.nome}
                                onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                            />
                            {errors.nome && <p>{errors.nome}</p>}

                            <label className='label-abrigo' htmlFor="quantidade">Quantidade:</label>
                            <input
                                className='input-abrigo'
                                type="text"
                                id="quantidade"
                                value={novoItem.quantidade}
                                onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                            />
                            {errors.quantidade && <p>{errors.quantidade}</p>}

                            <label className='label-abrigo' htmlFor="categoria">Categoria:</label>
                            <select
                                className='select-abrigo'
                                id="categoria"
                                value={novoItem.categoria}
                                onChange={(e) => setNovoItem({ ...novoItem, categoria: e.target.value })}
                            >
                                <option value="">Selecione uma categoria</option>
                                {categorias.map(categoria => (
                                    <option key={categoria.value} value={categoria.value}>{categoria.label}</option>
                                ))}
                            </select>
                            {errors.categoria && <p>{errors.categoria}</p>}

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Salvando...' : 'Salvar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showSearchModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowSearchModal(false)}>&times;</span>
                        <h3 className='text'>Buscar Item</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch();
                        }}>
                            <label className='label-abrigo' htmlFor="searchCriteria">Critério de busca:</label>
                            <select
                                className='select-abrigo'
                                id="searchCriteria"
                                value={searchCriteria}
                                onChange={(e) => setSearchCriteria(e.target.value)}
                            >
                                <option value="id">ID</option>
                                <option value="nome">Nome</option>
                                <option value="categoria">Categoria</option>
                            </select>

                            <label className='label-abrigo' htmlFor="searchValue">Valor da busca:</label>
                            <input
                                className='input-abrigo'
                                type="text"
                                id="searchValue"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />

                            <button type="submit">Buscar</button>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowDeleteModal(false)}>&times;</span>
                        <div className='text-container'>
                            <h3 className='text'>Confirmar exclusão</h3>
                            <p className='text'>Tem certeza que deseja excluir o item "{deleteItem?.nome}"?</p>
                        </div>
                        <button onClick={() => deleteItemById(deleteItem.id)}>Excluir</button>
                        <button onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardAbrigo;
