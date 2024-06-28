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
        id: null,
        nome: '',
        quantidade: '',
        categoria: '', // Inicialmente vazio
        abrigoId: id
    });
    const [showModal, setShowModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para controlar o modal de confirmação de exclusão
    const [deleteItem, setDeleteItem] = useState(null); // Estado para armazenar temporariamente o item a ser excluído
    const [searchCriteria, setSearchCriteria] = useState('id');
    const [searchValue, setSearchValue] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [duplicateItem, setDuplicateItem] = useState(null); // Estado para armazenar o item duplicado encontrado

    // Array de opções de categoria
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

    // Função assíncrona para buscar itens vinculados ao abrigo
    async function getItens() {
        try {
            const response = await api.get('/itens');
            const itensFiltrados = response.data.itens.filter(item => item.abrigoId === parseInt(id));
            setItens(itensFiltrados);
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
        }
    }

    // Função assíncrona para criar um item
    async function createItem() {
        try {
            // Verifica se já existe um item com o mesmo nome
            const itemExistente = itens.find(item => item.nome.toLowerCase() === novoItem.nome.toLowerCase());
            if (itemExistente) {
                setDuplicateItem(itemExistente); // Armazena o item duplicado encontrado
                setShowModal(false); // Fecha o modal de adição/edição
                setShowEditModal(true); // Abre o modal de confirmação de edição
                return; // Interrompe o fluxo aqui para não continuar com a criação
            }

            await api.post('/itens', novoItem);
            getItens();
            closeModal();
        } catch (error) {
            console.error('Erro ao criar item:', error);
        }
    }

    // Função assíncrona para atualizar um item
    async function updateItem() {
        try {
            await api.put(`/itens/${novoItem.id}`, novoItem);
            getItens();
            closeModal();
        } catch (error) {
            console.error(`Erro ao atualizar item com ID ${novoItem.id}:`, error);
        }
    }

    // Função assíncrona para deletar um item
    async function deleteItemConfirmed(id) {
        try {
            await api.delete(`/itens/${id}`);
            getItens();
            setShowDeleteModal(false); // Fecha o modal após a exclusão
        } catch (error) {
            console.error(`Erro ao deletar item com ID ${id}:`, error);
        }
    }

    // Função para abrir o modal de adição/edição de item
    function openModal(item = { id: null, nome: '', quantidade: '', categoria: '', abrigoId: id }) {
        // Definindo o item atualizado no estado do novoItem
        setNovoItem({ ...item, abrigoId: id });
        setShowModal(true);
        setDuplicateItem(null); // Limpa o estado do item duplicado ao abrir o modal
    }

    // Função para fechar o modal
    function closeModal() {
        setShowModal(false);
        // Reiniciando o estado do novoItem
        setNovoItem({
            id: null,
            nome: '',
            quantidade: '',
            categoria: '', // Inicialmente vazio
            abrigoId: id
        });
        setErrors({}); // Limpa os erros ao fechar o modal
    }

    // Função para lidar com a mudança nos campos do formulário
    function handleChange(event) {
        const { name, value } = event.target;
        setNovoItem({ ...novoItem, [name]: value });
    }

    // Função para lidar com o envio do formulário
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

    // Função para lidar com a submissão do formulário de pesquisa
    async function handleSearch(event) {
        event.preventDefault();
        try {
            const response = await api.get('/itens');
            const itensFiltrados = response.data.itens.filter(item => {
                if (item.abrigoId !== parseInt(id)) {
                    return false; // Filtra itens que não pertencem ao abrigo atual
                }
                if (searchCriteria === 'id') {
                    return item.id === parseInt(searchValue);
                } else if (searchCriteria === 'nome') {
                    return item.nome.toLowerCase().includes(searchValue.toLowerCase());
                } else if (searchCriteria === 'quantidade') {
                    return item.quantidade === parseInt(searchValue);
                } else if (searchCriteria === 'categoria') {
                    return item.categoria.toLowerCase().includes(searchValue.toLowerCase());
                }
                return false;
            });
            console.log('Itens encontrados:', itensFiltrados);
            setItens(itensFiltrados); // Atualiza os itens com o resultado da pesquisa
            setShowSearchModal(false); // Fecha o modal após a pesquisa
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

    // Efeito para carregar os itens ao montar o componente ou ao mudar o ID do abrigo
    useEffect(() => {
        getItens();
    }, [id]);

    // Estado para controlar o modal de edição do item existente
    const [showEditModal, setShowEditModal] = useState(false);

    // Função para fechar o modal de edição
    function closeEditModal() {
        setShowEditModal(false);
    }

    // Função para confirmar a edição do item duplicado
    function confirmEdit() {
        setNovoItem({ ...duplicateItem });
        setShowModal(true); // Abrir modal de adição/edição com os dados do item duplicado
        setShowEditModal(false); // Fechar modal de confirmação de edição
    }

    // Função para abrir o modal de confirmação de exclusão
    function openDeleteModal(item) {
        setDeleteItem(item); // Define o item que será excluído
        setShowDeleteModal(true); // Abre o modal de confirmação de exclusão
    }

    // Função para fechar o modal de confirmação de exclusão
    function closeDeleteModal() {
        setShowDeleteModal(false);
        setDeleteItem(null); // Limpa o item a ser excluído
    }

    return (
        <div className="dashboard-container">
            <h2>Itens do Abrigo</h2>
            <div className="button-container">
                <button onClick={() => openModal()}>Adicionar Item</button>
                <button onClick={() => setShowSearchModal(true)}>Pesquisar</button>
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
                                <button className='icon-button' onClick={() => openModal(item)}>
                                    <img src={Edit} alt="Editar"/>
                                </button>
                                <button className='icon-button' onClick={() => openDeleteModal(item)}>
                                    <img src={Trash} alt="Excluir"/>
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
                                {isSubmitting && errors.nome && <span className="error">{errors.nome}</span>}
                            </label>
                            <label>
                                Quantidade:
                                <input
                                    type="number"
                                    name="quantidade"
                                    value={novoItem.quantidade}
                                    onChange={handleChange}
                                    min="0"
                                />
                                {isSubmitting && errors.quantidade && <span className="error">{errors.quantidade}</span>}
                            </label>
                            <label>
                                Categoria:
                                <select name="categoria" value={novoItem.categoria} onChange={handleChange}>
                                    {categorias.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                    <option value="">Selecione uma categoria</option>
                                </select>
                                {isSubmitting && errors.categoria && <span className="error">{errors.categoria}</span>}
                            </label>
                            <button type="submit">Salvar</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para confirmação de edição do item duplicado */}
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeEditModal}>&times;</span>
                        <h3>Item Duplicado Encontrado</h3>
                        <h4>Já existe um item com o nome "{duplicateItem.nome}". Deseja editar este item?</h4>
                        <button onClick={confirmEdit}>Editar Item</button>
                        <button onClick={closeEditModal}>Cancelar</button>
                    </div>
                </div>
            )}

            {/* Modal para confirmação de exclusão */}
            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeDeleteModal}>&times;</span>
                        <h3>Confirmar Exclusão</h3>
                        <h4>Deseja realmente excluir o item "{deleteItem.nome}"?</h4>
                        <button onClick={() => deleteItemConfirmed(deleteItem.id)}>Sim</button>
                        <button onClick={closeDeleteModal}>Não</button>
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
