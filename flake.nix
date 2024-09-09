{
  description = "NanoPack support library for TypeScript";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs?tag=24.05";
  };

  outputs = { nixpkgs, ... }:
    let
      supportedSystems = [ "x86_64-linux" "x86_64-darwin" "aarch64-linux" "aarch64-darwin" ];

      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;

      nixpkgsFor = forAllSystems (system: import nixpkgs { inherit system; });
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = nixpkgsFor.${system};
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.nodejs_20
            ];
          };
        }
      );
    };
}
