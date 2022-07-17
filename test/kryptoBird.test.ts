/* eslint-disable node/no-missing-import */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from './chai-setup';
import { ethers } from 'hardhat';
import { KryptoBird } from '../typechain';

describe('KryptoBird Contract', () => {
  let kryptoBird: KryptoBird;
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let ownerAddress: string;
  let aliceAddress: string;
  const token: string = 'cryptBird';
  const token2: string = 'cryptBird2';

  beforeEach(async () => {
    const kryptBirdContract = await ethers.getContractFactory('KryptoBird');
    [owner, alice] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    aliceAddress = await alice.getAddress();
    kryptoBird = await kryptBirdContract.deploy('KryptoBird');
    await kryptoBird.deployed();
  });

  it('should have name', async () => {
    expect(await kryptoBird.name()).to.equal('KryptoBird');
  });

  it('should have symbol ', async () => {
    expect(await kryptoBird.symbol()).to.equal('KBIRDZ');
  });

  it('should return zero total', async () => {
    expect(await kryptoBird.totalSupply()).to.equal(0);
  });

  it('should mint', async () => {
    await kryptoBird.mint(token);
    await expect(await kryptoBird.kryptoBirdz(0)).to.equal(token);
    await expect(await kryptoBird.ownerOf(0)).to.equal(ownerAddress);
    await expect(await kryptoBird.balanceOf(ownerAddress)).to.equal(1);
    await expect(await kryptoBird.totalSupply()).to.equal(1);
    await expect(await kryptoBird.tokenByIndex(0)).to.equal(0);
  });

  it('should mint twice (different account)', async () => {
    await kryptoBird.mint(token);
    await kryptoBird.connect(alice).mint(token2);
    await expect(await kryptoBird.balanceOf(ownerAddress)).to.equal(1);
    await expect(await kryptoBird.balanceOf(aliceAddress)).to.equal(1);
    await expect(await kryptoBird.ownerOf(0)).to.equal(ownerAddress);
    await expect(await kryptoBird.ownerOf(1)).to.equal(aliceAddress);
    await expect(await kryptoBird.tokenByIndex(0)).to.equal(0);
    await expect(await kryptoBird.tokenByIndex(1)).to.equal(1);
    await expect(await kryptoBird.totalSupply()).to.equal(2);
    await expect(
      await kryptoBird.tokenOfOwnerByIndex(ownerAddress, 0)
    ).to.equal(0);
    await expect(
      await kryptoBird.tokenOfOwnerByIndex(aliceAddress, 0)
    ).to.equal(1);
  });

  it('should mint twice (same account)', async () => {
    await kryptoBird.mint(token);
    await kryptoBird.mint(token2);
    await expect(await kryptoBird.balanceOf(ownerAddress)).to.equal(2);
    await expect(await kryptoBird.ownerOf(0)).to.equal(ownerAddress);
    await expect(await kryptoBird.ownerOf(1)).to.equal(ownerAddress);
    await expect(await kryptoBird.totalSupply()).to.equal(2);
    await expect(
      await kryptoBird.tokenOfOwnerByIndex(ownerAddress, 0)
    ).to.equal(0);
    await expect(
      await kryptoBird.tokenOfOwnerByIndex(ownerAddress, 1)
    ).to.equal(1);
  });

  it('should mint with Transfer event', async () => {
    await expect(kryptoBird.mint('cryptBird'))
      .to.emit(kryptoBird, 'Transfer')
      .withArgs(ethers.constants.AddressZero, ownerAddress, 0);
  });

  it('should transfer a token', async () => {
    await kryptoBird.connect(owner).mint(token);
    await kryptoBird.transferFrom(ownerAddress, aliceAddress, 0);
    await expect(await kryptoBird.balanceOf(ownerAddress)).to.equal(0);
    await expect(await kryptoBird.balanceOf(aliceAddress)).to.equal(1);
    await expect(await kryptoBird.ownerOf(0)).to.equal(aliceAddress);
  });

  it('should transfer with Transfer event', async () => {
    await kryptoBird.connect(owner).mint(token);
    await expect(kryptoBird.transferFrom(ownerAddress, aliceAddress, 0))
      .to.emit(kryptoBird, 'Transfer')
      .withArgs(ownerAddress, aliceAddress, 0);
  });

  it('should approve with Approval event', async () => {
    await kryptoBird.connect(owner).mint(token);
    await expect(kryptoBird.approve(aliceAddress, 0))
      .to.emit(kryptoBird, 'Approval')
      .withArgs(ownerAddress, aliceAddress, 0);
  });

  // REVERT TEST

  it('should be reverted when the token already minted', async () => {
    await kryptoBird.mint(token);
    await expect(kryptoBird.mint(token)).to.be.revertedWith(
      'KryptoBird already exists'
    );
  });

  it('should be reverted when owner address invalid', async () => {
    await expect(
      kryptoBird.balanceOf(ethers.constants.AddressZero)
    ).to.be.revertedWith('ERC721: invalid owner address');
  });

  it('should be reverted when token does not exist', async () => {
    await expect(kryptoBird.ownerOf(0)).to.be.revertedWith(
      'ERC721: invalid token ID'
    );
  });

  it('should be reverted when calling tokenByIndex with invalid index', async () => {
    await expect(kryptoBird.tokenByIndex(10000)).to.be.revertedWith(
      'ERC721: index out of range'
    );
  });

  it('should be reverted when calling tokenOfOwnerByIndex with invalid index', async () => {
    await expect(
      kryptoBird.tokenOfOwnerByIndex(ownerAddress, 10000)
    ).to.be.revertedWith('ERC721: index out of range');
  });

  it('should be reverted when transfer from invalid address', async () => {
    await kryptoBird.connect(owner).mint(token);
    await expect(
      kryptoBird.transferFrom(ethers.constants.AddressZero, aliceAddress, 0)
    ).to.be.revertedWith('ERC721: invalid address');
  });

  it('should be reverted when transfer to invalid address', async () => {
    await kryptoBird.connect(owner).mint(token);
    await expect(
      kryptoBird.transferFrom(ownerAddress, ethers.constants.AddressZero, 0)
    ).to.be.revertedWith('ERC721: invalid address');
  });

  it('should be reverted when invalid owner transfer', async () => {
    await kryptoBird.connect(owner).mint(token);
    await expect(
      kryptoBird.transferFrom(aliceAddress, ownerAddress, 0)
    ).to.be.revertedWith('ERC721: caller is not owner');
  });

  it('should be reverted when not owner approve', async () => {
    await kryptoBird.connect(owner).mint(token);
    await expect(
      kryptoBird.connect(alice).approve(ownerAddress, 0)
    ).to.be.revertedWith('ERC721: caller is not owner');
  });

  it('should be reverted when owner approve self', async () => {
    await kryptoBird.connect(owner).mint(token);
    await expect(
      kryptoBird.connect(owner).approve(ownerAddress, 0)
    ).to.be.revertedWith('ERC721: cannot approve to self');
  });
  it('should be reverted when approve twice', async () => {
    await kryptoBird.connect(owner).mint(token);
    await kryptoBird.approve(aliceAddress, 0);
    await expect(kryptoBird.approve(aliceAddress, 0)).to.be.revertedWith(
      'ERC721: token already approved'
    );
  });
});
