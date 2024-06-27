import React, { useState, useEffect } from 'react';
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
        id: null,
        nome: '',
        endereco: ''
    });
    const [searchCriteria, setSearchCriteria] = useState('id');
    const [searchValue, setSearchValue] = useState('');
    const [duplicateAbrigo, setDuplicateAbrigo] = useState(null); // Estado para armazenar o abrigo duplicado encontrado
    const [errors, setErrors] = useState({}); // Estado para armazenar mensagens de erro de validação
    const [deleteConfirmationName, setDeleteConfirmationName] = useState(''); // Estado para armazenar o nome de confirmação de exclusão

    const navigate = useNavigate();

    const handleVisualizar = (id) => {
        navigate(`/dashboard-abrigo/${id}`);
    };

    // Função assíncrona para mostrar abrigos com opção de filtro
    async function getAbrigos() {
        try {
            const response = await api.get('/abrigos');
            setAbrigos(response.data.abrigos);
        } catch (error) {
            console.error('Erro ao buscar abrigos:', error);
        }
    }

    // Função assíncrona para criar um abrigo
    async function createAbrigo() {
        try {
            // Verifica se há campos vazios
            if (!validateForm()) {
                return;
            }

            // Verifica se já existe um abrigo com o mesmo nome
            const abrigoExistente = abrigos.find(abrigo => abrigo.nome.toLowerCase() === novoAbrigo.nome.toLocaleLowerCase());
            if (abrigoExistente) {
                setDuplicateAbrigo(abrigoExistente); // Armazena o abrigo duplicado encontrado
                setShowModal(false); // Fecha o modal de adição/edição
                setShowDuplicateModal(true); // Abre o modal de confirmação de edição
                return; // Interrompe o fluxo aqui para não continuar com a criação
            }
            console.log('Pre post')
            await api.post('/abrigos', {
                nome: novoAbrigo.nome,
                endereco: novoAbrigo.endereco,
            });
            await getAbrigos(); // Atualiza a lista de abrigos após a criação
            closeModal();
        } catch (error) {
            console.error('Erro ao criar abrigo:', error);
        }
    }

    // Função assíncrona para atualizar um abrigo
    async function updateAbrigo() {
        try {
            await api.put(`/abrigos/${novoAbrigo.id}`, {
                nome: novoAbrigo.nome,
                endereco: novoAbrigo.endereco,
            });
            await getAbrigos(); // Atualiza a lista de abrigos após a atualização
            closeModal();
        } catch (error) {
            console.error(`Erro ao atualizar abrigo com ID ${novoAbrigo.id}:`, error);
        }
    }

    // Função assíncrona para deletar um abrigo
    async function deleteAbrigo(id) {
        try {
            await api.delete(`/abrigos/${id}`);
            await getAbrigos(); // Atualiza a lista de abrigos após a exclusão
        } catch (error) {
            console.error(`Erro ao deletar abrigo com ID ${id}:`, error);
        }
    }

    // Função para abrir o modal de adição/edição de abrigo
    function openModal(abrigo = { id: null, nome: '', endereco: '' }) {
        setNovoAbrigo(abrigo);
        setShowModal(true);
        setDuplicateAbrigo(null); // Limpa o estado do abrigo duplicado ao abrir o modal
        setErrors({}); // Limpa os erros ao abrir o modal
    }

    // Função para fechar o modal
    function closeModal() {
        setShowModal(false);
        setNovoAbrigo({ id: null, nome: '', endereco: '' });
        setErrors({}); // Limpa os erros ao fechar o modal
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
            const response = await api.get('/abrigos');
            const abrigosFiltrados = response.data.abrigos.filter(abrigo => { //ajuste aqui 
                if (searchCriteria === 'id') {
                    return abrigo.id === parseInt(searchValue);
                } else if (searchCriteria === 'nome') {
                    return abrigo.nome.toLowerCase().includes(searchValue.toLowerCase());
                } else if (searchCriteria === 'endereco') {
                    return abrigo.endereco.toLowerCase().includes(searchValue.toLowerCase());
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

    // Função para validar o formulário antes da criação ou atualização
    function validateForm() {
        let formErrors = {};
        if (!novoAbrigo.nome) formErrors.nome = "Nome é obrigatório";
        if (!novoAbrigo.endereco) formErrors.endereco = "Localização é obrigatória";
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    }

    // Função para abrir o modal de confirmação de exclusão
    function openDeleteModal(abrigo) {
        setDeleteConfirmationName('');
        setNovoAbrigo(abrigo);
        setShowDeleteModal(true);
    }

    // Função para fechar o modal de confirmação de exclusão
    function closeDeleteModal() {
        setShowDeleteModal(false);
        setDeleteConfirmationName('');
    }

    // Função para lidar com a exclusão do abrigo após confirmação
    async function handleDeleteConfirmation() {
        if (deleteConfirmationName.toLowerCase() === novoAbrigo.nome.toLowerCase()) {
            await deleteAbrigo(novoAbrigo.id);
            setShowDeleteModal(false);
        } else {
            setShowDeleteModal(false);
            setShowNameMismatchModal(true);
        }
    }

    // Estado para controlar o modal de confirmação de edição do abrigo duplicado
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    // Estado para controlar o modal de confirmação de nome incorreto
    const [showNameMismatchModal, setShowNameMismatchModal] = useState(false);
    // Estado para controlar o modal de exclusão
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Função para fechar o modal de confirmação de edição
    function closeDuplicateModal() {
        setShowDuplicateModal(false);
    }

    // Função para fechar o modal de confirmação de nome incorreto
    function closeNameMismatchModal() {
        setShowNameMismatchModal(false);
    }

    // Função para confirmar a edição do abrigo duplicado
    function confirmEdit() {
        setNovoAbrigo({ ...duplicateAbrigo });
        setShowModal(true); // Abrir modal de adição/edição com os dados do abrigo duplicado
        setShowDuplicateModal(false); // Fechar modal de confirmação de edição
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
                                <td>{abrigo.endereco}</td>
                                <td>
                                    <button className='icon-button' onClick={() => openModal(abrigo)}>
                                        <img src={Edit} alt="Editar" />
                                    </button>
                                    <button className='icon-button' onClick={() => openDeleteModal(abrigo)}>
                                        <img src={Trash} alt="Excluir" />
                                    </button>
                                    <button className='icon-button' onClick={() => handleVisualizar(abrigo.id)}>
                                        <img src={View} alt="Visualizar" />
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
                                    {errors.nome && <span className="error">{errors.nome}</span>}
                                </label>
                                <label>
                                    Localização:
                                    <input
                                        type="text"
                                        name="endereco"
                                        value={novoAbrigo.endereco}
                                        onChange={handleChange}
                                    />
                                    {errors.endereco && <span className="error">{errors.endereco}</span>}
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
                                        <option value="endereco">Localização</option>
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

                {/* Modal para confirmação de exclusão */}
                {showDeleteModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeDeleteModal}>&times;</span>
                            <h3>Excluir Abrigo</h3>
                            <h4>Digite o nome do abrigo para confirmar a exclusão:</h4>
                            <input
                                type="text"
                                value={deleteConfirmationName}
                                onChange={(e) => setDeleteConfirmationName(e.target.value)}
                                placeholder="Digite o nome do abrigo"
                            />
                            <div>
                                <button onClick={handleDeleteConfirmation}>Excluir</button>
                                <button onClick={closeDeleteModal}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal para informar que o nome digitado está incorreto */}
                {showNameMismatchModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeNameMismatchModal}>&times;</span>
                            <h3>Nome Incorreto</h3>
                            <h4>O nome digitado não corresponde ao nome do abrigo "{novoAbrigo.nome}".</h4>
                            <button onClick={closeNameMismatchModal}>OK</button>
                        </div>
                    </div>
                )}

                {/* Modal para confirmação de edição do abrigo duplicado */}
                {showDuplicateModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeDuplicateModal}>&times;</span>
                            <h3>Abrigo Duplicado Encontrado</h3>
                            <h4>Já existe um abrigo com o nome "{duplicateAbrigo.nome}". Deseja editar este abrigo?</h4>
                            <button onClick={confirmEdit}>Editar Abrigo</button>
                            <button onClick={closeDuplicateModal}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default DashboardUsuario;
