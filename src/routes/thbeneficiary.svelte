<script>
  import Card from "../components/Card.svelte";
  import { onMount } from "svelte";
  import http from "../http";
  const moment = require('moment');


  let thBeneficiaries = [];
  let thBeneficary = {};

  let buttonSaveIsLoading = false;
  $: buttonSaveClass =
    buttonSaveIsLoading === true
      ? "button is-success is-loading"
      : "button is-success";

  let modalIsVisible = false;
  $: modalClass = modalIsVisible === true ? "modal is-active" : "modal";

  onMount(async () => {
    thBeneficiaries = getThBeneficiaries();
  });

  async function getThBeneficiaries() {
    // a simple use of "fetch"
    const result = await fetch("http://localhost:3105/api/Tp35Beneficiaries");
    if (result.ok) return result.json();

    throw new Error(
      `🚨 Catastrofic failure 🚨 ${result.status} ${result.statusText}`
    );
  }

  function onItemClick(item) {
    thBeneficary = item;
    openModal();
  }

  async function onDeleteClick(item) {
    thBeneficary = item;
    if (confirm(`Delete "${thBeneficary.firstName}"?`)){
      await http.delete(`/Tp35Beneficiaries/${thBeneficary.id}`)
      thBeneficiaries = getThBeneficiaries();
    }
  }

  function closeModal() {
    modalIsVisible = false;
  }

  function openModal() {
    modalIsVisible = true;
  }

  function onNewClick() {
    thBeneficary = {
      email: '',
      firstName: '',
      lastName: '',
      status: '',
      username: '',
      updatedAt: ''
    }
    openModal()
  }

  async function save() {
    try {
      buttonSaveIsLoading = true;
      console.log('thBeneficary=========+++>', thBeneficary);

      let result = await http({
        method: thBeneficary.id ? "put" : "post",
        url: thBeneficary.id ? `/Tp35Beneficiaries/${thBeneficary.id}` : "/Tp35Beneficiaries",
        data: {
          ...thBeneficary,
          updatedAt: new Date(),
          origin: 1
        }
      });

      thBeneficiaries = getThBeneficiaries();
      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      buttonSaveIsLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Th Beneficiaries</title>
</svelte:head>

<Card title="Th Beneficiaries">
  <div>

    {#await thBeneficiaries}
      <progress class="progress is-small is-primary" max="100">15%</progress>
    {:then list}

      <table class="table is-striped is-hoverable">
        <thead>
          <tr>
            <th>Email</th>
            <th>First name</th>
            <th>LastName</th>
            <th>Status</th>
            <th>Username</th>
            <th width="100px">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each list as item}
            <tr>
              <td>{item.email}</td>
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>
              <td>{item.status}</td>
              <td>{item.username}</td>
              <td>
                <a href="javascript:;" on:click={() => onItemClick(item)}>
                  <span class="icon is-small">
                    <i class="fas fa-edit" />
                  </span>
                </a>

                <a href="javascript:;" on:click={() => onDeleteClick(item)}>
                  <span class="icon is-small">
                    <i class="fas fa-trash" />
                  </span>
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}

  </div>
    <a href="javascript:;" slot="footer" class="card-footer-item" on:click={onNewClick}>New</a>
</Card>

<div class={modalClass}>
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{thBeneficary.firstName}</p>
      <button class="delete" aria-label="close" on:click={closeModal} />
    </header>
    <section class="modal-card-body">
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input
            class="input"
            type="email"
            placeholder=""
            bind:value={thBeneficary.email} />
        </div>
      </div>
      <div class="field">
        <label class="label">FirstName</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder=""
            bind:value={thBeneficary.firstName} />
        </div>
      </div>
      <div class="field">
        <label class="label">LastName</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder=""
            bind:value={thBeneficary.lastName} />
        </div>
      </div>
      <div class="field">
        <label class="label">Status</label>
        <div class="control">
          <input
            class="input"
            type="number"
            placeholder=""
            bind:value={thBeneficary.status} />
        </div>
      </div>
      <div class="field">
        <label class="label">Username</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder=""
            bind:value={thBeneficary.username} />
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class={buttonSaveClass} on:click={save}>Save changes</button>
      <button class="button" on:click={closeModal}>Cancel</button>
    </footer>
  </div>
</div>
