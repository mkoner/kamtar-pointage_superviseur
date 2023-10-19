function UserCard() {
  return (
    <section id="formulaire">
      <div class="container">
        <div class="row" style="position: relative; margin-top: 20px">
          <div class="col-md-12">
            <div id="formulaire_form">
              <br />
              <div class="col-12 grid-margin">
                <div class="card">
                  <div class="card-body">
                    <h1
                      style="font-weight: 300"
                      id="titre_page"
                      class="title-page"
                        ></h1>
                          
                    <form class="form-sample" id="form_client">
            
                      <div class="row row-cards">
                        <div class="col-md-6">
                          <div class="bloc-card">
                            <div class="form-group form-item">
                              <label
                                class="col-form-label"
                                data-i18n="client.nom_obligatoire"
                              ></label>
                              <div>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="nom"
                                  placeholder="Nom du client"
                                />
                              </div>
                                                      </div>
                                                      
                            
                            <div class="form-group form-item">
                              <label
                                class="col-form-label"
                                data-i18n="client.email_obligatoire"
                              ></label>
                              <div>
                                <input
                                  type="email"
                                  class="form-control"
                                  readonly
                                  onfocus="this.removeAttribute('readonly');"
                                  id="contact_email_client"
                                  data-name="contact_email_client"
                                  name="contact_email_client"
                                  placeholder="Email principal du client"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserCard;
