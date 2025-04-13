$(document).ready(function () {
  $("#searchUser").on("keyup", function (e) {
    let username = e.target.value.trim();

    if (username !== "") {
      $("#profile").html("");
      $("#spinner").removeClass("d-none");

      // First AJAX request to get user data
      $.ajax({
        url: `http://localhost:4000/github-user/${username}`,
        method: "GET",
      })
        .done(function (user) {
          
          $.ajax({
            url: `http://localhost:4000/github-user/${username}/repos`,
            method: "GET",
          })
            .done(function (repos) {
            
              let latestRepos = repos.filter((repo) => !repo.pinned);

              $("#spinner").addClass("d-none");

              let latestRepoCards = latestRepos.map((repo) => `
                <div class="card shadow-sm mb-3" style="margin-bottom: 10px;">
                  <div class="card-body p-3">
                    <div class="d-flex flex-column flex-md-row">
                      <div class="flex-grow-1">
                        <h5 class="card-title" style="font-size: 1.1rem; margin-bottom: 5px;">${repo.name}</h5>
                        <p class="card-text" style="font-size: 0.9rem; margin-bottom: 10px;">${repo.description || "No description available"}</p>
                        <div class="mb-2">
                          <span class="badge bg-secondary" style="font-size: 0.85rem;">Forks: ${repo.forks_count}</span>
                          <span class="badge bg-info text-dark" style="font-size: 0.85rem;">Watchers: ${repo.watchers_count}</span>
                          <span class="badge bg-success" style="font-size: 0.85rem;">Stars: ${repo.stargazers_count}</span>
                        </div>
                      </div>
                      <div class="ms-md-3 mt-3 mt-md-0 text-md-end">
                        <a href="${repo.html_url}" target="_blank" class="btn btn-outline-primary btn-sm">Visit Repo</a>
                      </div>
                    </div>
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
                  <!-- Latest Repositories Section -->
                  <div class="col-md-6">
                    <h5 class="mb-3">Latest Repositories</h5>
                    ${latestRepoCards}
                  </div>
                 
               
              `);
            })
            .fail(function () {
              $("#spinner").addClass("d-none");
              $("#profile").html(`<div class="alert alert-danger">Repositories not found or server error</div>`);
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
