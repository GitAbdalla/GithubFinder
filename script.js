$(document).ready(function () {
    $("#searchUser").on("keyup", function (e) {
      let username = e.target.value.trim();
  
      if (username !== "") {
        $("#profile").html("");
        $("#spinner").removeClass("d-none");
  
        $.ajax({
          url: `http://localhost:4000/github-user/${username}`,
          method: "GET",
        })
          .done(function (user) {
          
            $.ajax({
              url: `http://localhost:4000/github-user/${username}/repos`,
              method: "GET",
            }).done(function (repos) {
              $("#spinner").addClass("d-none");
  
              let repoCards = repos.map((repo) => `
                <div class="card shadow-sm mb-3">
                  <div class="card-body">
                    <h5 class="card-title">${repo.name}</h5>
                    <p class="card-text">${repo.description || ""}</p>
                    <div class="mb-2">
                      <span class="badge bg-secondary">Forks: ${repo.forks_count}</span>
                      <span class="badge bg-info text-dark">Watchers: ${repo.watchers_count}</span>
                      <span class="badge bg-success">Stars: ${repo.stargazers_count}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="btn btn-outline-primary btn-sm">Visit Repo</a>
                  </div>
                </div>
              `).join("");
  
              $("#profile").html(`
                <div class="card mb-4 shadow-lg">
                  <div class="card-header bg-primary text-white">
                    <h4>${user.name || user.login}</h4>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-3 text-center">
                        <img src="${user.avatar_url}" class="img-fluid rounded-circle mb-2" />
                        <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-sm w-100">View Profile</a>
                      </div>
                      <div class="col-md-9">
                        <p>
                          <span class="badge bg-dark">Public Repos: ${user.public_repos}</span>
                          <span class="badge bg-success">Followers: ${user.followers}</span>
                          <span class="badge bg-info text-dark">Following: ${user.following}</span>
                        </p>
                        <ul class="list-group">
                          <li class="list-group-item">Company: ${user.company || "N/A"}</li>
                          <li class="list-group-item">Website/blog: <a href="${user.blog}" target="_blank">${user.blog}</a></li>
                          <li class="list-group-item">Location: ${user.location || "N/A"}</li>
                          <li class="list-group-item">Member Since: ${new Date(user.created_at).toLocaleDateString()}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <h5 class="mt-4">Latest Repositories</h5>
                ${repoCards}
              `);
            });
          })
          .fail(function () {
            $("#spinner").addClass("d-none");
            $("#profile").html(`<div class="alert alert-danger">User not found or server error</div>`);
          });
      } else {
        $("#profile").html("");
      }
    });
  });
  